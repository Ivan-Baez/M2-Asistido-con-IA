const OpenAI = require("openai");
const Movie = require("../models/movieModel");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

const SYSTEM_PROMPT = `Eres Lumière, un asistente virtual cinematográfico con personalidad cálida, culta y conversacional. 

Tu especialidad es el cine: historia, directores, técnicas, géneros, premios, recomendaciones. Pero también respondes preguntas generales con naturalidad.

Estilo:
- Tono amigable, cercano, sin ser robótico
- Usas emojis ocasionales (🎬 ✨ 🍿 🎥) pero sin abusar
- Respuestas concisas pero completas
- Si no sabes algo, lo admites honestamente
- Mantienes el contexto de la conversación
- Cuando el usuario pregunta por SU catálogo, usas los datos que te pasan

Formato: Markdown ligero (negritas, listas). Nada de HTML.`;

async function getRecommendationsFromDB(preferences = {}) {
  const { genre, minRate, maxYear, minYear, limit = 5 } = preferences;
  
  const query = {};
  if (genre) query.genre = { $in: [new RegExp(genre, 'i')] };
  if (minRate) query.rate = { $gte: parseFloat(minRate) };
  if (minYear || maxYear) {
    query.year = {};
    if (minYear) query.year.$gte = parseInt(minYear);
    if (maxYear) query.year.$lte = parseInt(maxYear);
  }

  try {
    const movies = await Movie.find(query)
      .sort({ rate: -1, year: -1 })
      .limit(limit)
      .lean();
    return movies;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
}

function parsePreferences(message) {
  const preferences = {};
  const lower = message.toLowerCase();
  
  const genreMatch = lower.match(/(accion|acción|terror|aventura|drama|comedia|ciencia ficcion|ciencia ficción|sci-fi|fantasia|fantasía|animacion|animación|documental|thriller|suspenso|romance|noir|western|musical)/);
  if (genreMatch) preferences.genre = genreMatch[1];
  
  const rateMatch = lower.match(/(?:mayor a|superior a|mas de|más de|sobre|por encima de)\s*(\d+(?:\.\d+)?)/);
  if (rateMatch) preferences.minRate = rateMatch[1];
  
  const yearMatch = lower.match(/(?:despues de|después de|posterior a|desde|a partir de)\s*(\d{4})/);
  if (yearMatch) preferences.minYear = yearMatch[1];
  
  const yearBeforeMatch = lower.match(/(?:antes de|anterior a|hasta)\s*(\d{4})/);
  if (yearBeforeMatch) preferences.maxYear = yearBeforeMatch[1];
  
  return preferences;
}

function formatRecommendations(movies) {
  if (!movies.length) {
    return 'No encontré películas que coincidan exactamente en tu catálogo. ¿Quieres que amplíe la búsqueda o busques en general?';
  }
  
  let response = `🎬 **Recomendaciones de tu catálogo:**\n\n`;
  movies.forEach((m, i) => {
    response += `${i + 1}. **${m.title}** (${m.year})\n`;
    response += `   🎭 ${m.genre.join(', ')} | ⭐ ${m.rate}/10 | 🎬 ${m.director}\n\n`;
  });
  response += '¿Quieres más detalles de alguna o buscas algo diferente?';
  return response;
}

function buildUserContext(userMovies = []) {
  if (!userMovies.length) return '';
  
  const total = userMovies.length;
  const avgRate = (userMovies.reduce((a, b) => a + b.rate, 0) / total).toFixed(1);
  const genres = {};
  userMovies.forEach(m => m.genre.forEach(g => genres[g] = (genres[g] || 0) + 1));
  const topGenres = Object.entries(genres).sort((a,b) => b[1]-a[1]).slice(0, 3).map(([g,c]) => `${g} (${c})`).join(', ');
  const topRated = [...userMovies].sort((a,b) => b.rate - a.rate).slice(0, 3).map(m => `${m.title} (${m.year}) ⭐${m.rate}`).join('; ');
  
  return `\n\n[CONTEXTO CATÁLOGO USUARIO: ${total} películas | Promedio: ${avgRate}/10 | Géneros top: ${topGenres} | Mejor valoradas: ${topRated}]`;
}

async function callLLM(userMessage, userMovies = [], conversationHistory = []) {
  const hasApiKey = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "dummy-key";
  
  if (!hasApiKey) {
    return getFallbackResponse(userMessage, userMovies);
  }

  const userContext = buildUserContext(userMovies);
  
  const messages = [
    { role: "system", content: SYSTEM_PROMPT + userContext },
    ...conversationHistory.slice(-6).map(m => ({ role: m.role, content: m.content })),
    { role: "user", content: userMessage }
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "openrouter/free",
      messages,
      temperature: 0.7,
      max_tokens: 500,
      presence_penalty: 0.3,
      frequency_penalty: 0.2,
    });
    
    return completion.choices[0].message.content;
  } catch (error) {
    console.error('LLM Error:', error.message);
    return getFallbackResponse(userMessage, userMovies);
  }
}

function getFallbackResponse(userMessage, userMovies = []) {
  const lower = userMessage.toLowerCase().trim();
  
  // Quick local handlers for common patterns
  if (/cuanto es|cuánto es|calcula|calcular/.test(lower)) {
    try {
      const expr = lower.replace(/[^0-9+\-*/().\s]/g, '').trim();
      if (expr) return `El resultado es **${eval(expr)}**. 🧮`;
    } catch { }
  }
  
  if (/que hora|qué hora/.test(lower)) {
    return `Son las **${new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}**. 🕐`;
  }
  
  if (/que dia|qué día|fecha|hoy es/.test(lower)) {
    return `Hoy es **${new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}**. 📅`;
  }
  
  if (/chiste|broma|hazme reir|hazme reír/.test(lower)) {
    const jokes = [
      '¿Por qué los programadores prefieren el modo oscuro? Porque la luz atrae a los bugs. 🐛',
      '¿Cuál es la película favorita de un desarrollador? "El código Da Vinci"... ¡porque tiene "código"! 💻',
      '¿Por qué el cine mudo no tenía subtítulos? Porque aún no se habían inventado los "sub-títulos". 🎭',
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }
  
  if (/dato curioso|curiosidad|sabias que|sabías que/.test(lower)) {
    const facts = [
      '🎬 El rugido del león de MGM se grabó en 1928 y se sigue usando. Se llamaba "Jackie".',
      '🎬 En "El Padrino", el gato que acaricia Brando era un callejero que Coppola encontró en el set.',
      '🎬 "Titanic" (1997) costó más de hacer que el barco original (ajustado a inflación).',
      '🎬 La frase exacta en Star Wars es: "No, yo soy tu padre" (no "Luke, yo soy tu padre").',
      '🎬 El código verde de Matrix son... recetas de sushi japonesas. 🍣',
    ];
    return facts[Math.floor(Math.random() * facts.length)];
  }

  // Check for recommendation intent
  if (/recomienda|recomendación|sugiere|que ver|qué ver|busco|buscar|pelicula|película|ver algo|similar a|parecida a/.test(lower)) {
    return { needsRecommendation: true, lower };
  }

  // Conversational fallback
  const conversational = [
    'Interesante... 🤔 Cuéntame más sobre eso.',
    '¡Vaya! No había pensado en eso. ¿Qué te llevó a esa pregunta?',
    'Me gusta tu curiosidad. ¿Hay algo específico en lo que te pueda ayudar?',
    'Hmm, buena pregunta. ¿Buscas información técnica, una recomendación, o solo charlar?',
    '¡Qué tema tan chulo! 🎬 Aunque me especializo en cine, me encanta aprender cosas nuevas.'
  ];
  
  // Greetings
  if (/hola|buenas|hey|buenos dias|buenos días|buenas tardes|buenas noches|que tal|qué tal/.test(lower)) {
    return '¡Hola! ✨ Soy Lumière, tu asistente cinematográfico. ¿En qué te ayudo hoy? 🎬';
  }
  if (/gracias|thx|thanks|te agradezco|muchas gracias/.test(lower)) {
    return '¡De nada! 😊 Disfruta de lo que elijas ver. 🍿';
  }
  if (/adios|adiós|chao|hasta luego|nos vemos|bye/.test(lower)) {
    return '¡Hasta la próxima! 🎥 Que tengas una excelente sesión de cine.';
  }
  if (/quien eres|quién eres|como te llamas|cómo te llamas|eres un bot|eres una ia|qué eres|que eres/.test(lower)) {
    return 'Soy Lumière 🎬, un asistente virtual especializado en cine pero con conocimientos generales. Mi nombre rinde homenaje a los hermanos Lumière, pioneros del cine.';
  }
  if (/que puedes|qué puedes|para que sirves|para qué sirves|ayuda|help|comandos/.test(lower)) {
    return `🎬 **Puedo ayudarte con:**
• **Cine/Series**: Recomendaciones, historia, directores, técnicas, premios
• **Tu catálogo**: Ver tus películas, stats, favoritas
• **Conocimiento general**: Preguntas de cultura, ciencia, tecnología, etc.
• **Creatividad**: Ideas para guiones, nombres, diálogos
• **Charla casual**: Solo conversar si te apetece

¿Por dónde empezamos?`;
  }

  return conversational[Math.floor(Math.random() * conversational.length)];
}

async function processMessage(userMessage, userMovies = [], conversationHistory = []) {
  const lower = userMessage.toLowerCase().trim();
  
  if (!lower) {
    return { 
      response: 'No recibí ningún mensaje. ¿En qué te ayudo? 😊', 
      movies: [],
      state: 'idle'
    };
  }

  // Check if user wants recommendations from their catalog
  const wantsRecommendation = /recomienda|recomendación|sugiere|que ver|qué ver|busco|buscar|pelicula|película|ver algo|similar a|parecida a|basada en|tipo/.test(lower);
  
  let movies = [];
  let state = 'idle';
  let response = '';

  if (wantsRecommendation) {
    state = 'thinking';
    const preferences = parsePreferences(userMessage);
    movies = await getRecommendationsFromDB(preferences);
    response = formatRecommendations(movies);
    state = 'speaking';
  } else {
    state = 'thinking';
    response = await callLLM(userMessage, userMovies, conversationHistory);
    
    // Handle fallback that returns object (needsRecommendation)
    if (typeof response === 'object' && response.needsRecommendation) {
      const preferences = parsePreferences(response.lower);
      movies = await getRecommendationsFromDB(preferences);
      response = formatRecommendations(movies);
    }
    
    state = 'speaking';
  }

  // Add user catalog context if relevant
  if (userMovies.length > 0 && /mi catalogo|mi catálogo|mis peliculas|mis películas|tengo|mi colección|favorita|mejor valorada|peor/.test(lower)) {
    if (/mejor valorada|mejor puntuada|top|favorita|la mejor/.test(lower)) {
      const top = [...userMovies].sort((a, b) => b.rate - a.rate)[0];
      response += `\n\n🏆 **Tu mejor valorada:** **${top.title}** (${top.year}) — ⭐ ${top.rate}/10`;
    } else if (/peor|menor|la peor/.test(lower)) {
      const bottom = [...userMovies].sort((a, b) => a.rate - b.rate)[0];
      response += `\n\n📉 **La menos valorada:** **${bottom.title}** (${bottom.year}) — ⭐ ${bottom.rate}/10`;
    } else if (/cuantas|cuántas|total|numero|número/.test(lower)) {
      response += `\n\n📊 **Tu catálogo:** ${userMovies.length} película${userMovies.length !== 1 ? 's' : ''} total.`;
    } else if (/genero|género/.test(lower)) {
      const genres = {};
      userMovies.forEach(m => m.genre.forEach(g => genres[g] = (genres[g] || 0) + 1));
      const topGenre = Object.entries(genres).sort((a,b) => b[1]-a[1])[0];
      response += `\n\n🎭 **Tu género favorito:** ${topGenre[0]} (${topGenre[1]} película${topGenre[1] !== 1 ? 's' : ''})`;
    }
  }
  
  return { response, movies, state };
}

module.exports = {
  processMessage,
  getRecommendationsFromDB,
  parsePreferences,
};