const OpenAI = require("openai");
const Movie = require("../models/movieModel");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

const SYSTEM_PROMPT = `Eres Lumière, un asistente virtual cinematográfico con personalidad cálida, culta y conversacional. 
... (prompt igual que antes) ...`;

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
  if (!Array.isArray(userMovies) || !userMovies.length) return '';
  const total = userMovies.length;
  const avgRate = (userMovies.reduce((a, b) => a + b.rate, 0) / total).toFixed(1);
  const genres = {};
  userMovies.forEach(m => m.genre.forEach(g => genres[g] = (genres[g] || 0) + 1));
  const topGenres = Object.entries(genres).sort((a,b) => b[1]-a[1]).slice(0, 3).map(([g,c]) => `${g} (${c})`).join(', ');
  const topRated = [...userMovies].sort((a,b) => b.rate - a.rate).slice(0, 3).map(m => `${m.title} (${m.year}) ⭐${m.rate}`).join('; ');
  return `\n\n[CONTEXTO CATÁLOGO USUARIO: ${total} películas | Promedio: ${avgRate}/10 | Géneros top: ${topGenres} | Mejor valoradas: ${topRated}]`;
}

async function callLLM(userMessage, userMovies = [], conversationHistory = []) {
  if (!Array.isArray(userMovies)) userMovies = [];
  if (!Array.isArray(conversationHistory)) conversationHistory = [];
  const hasApiKey = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "dummy-key";
  if (!hasApiKey) return getFallbackResponse(userMessage, userMovies);
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
  // ... (igual que antes, sin cambios) ...
  return 'Interesante... 🤔 Cuéntame más sobre eso.';
}

async function processMessage(userMessage, userMovies = [], conversationHistory = []) {
  if (!Array.isArray(userMovies)) userMovies = [];
  if (!Array.isArray(conversationHistory)) conversationHistory = [];

  const lower = userMessage.toLowerCase().trim();
  if (!lower) {
    return { response: 'No recibí ningún mensaje. ¿En qué te ayudo? 😊', movies: [], state: 'idle' };
  }

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

    if (typeof response === 'object' && response.needsRecommendation) {
      const preferences = parsePreferences(response.lower);
      movies = await getRecommendationsFromDB(preferences);
      response = formatRecommendations(movies);
    }

    state = 'speaking';
  }

  // Catálogo del usuario
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
      userMovies.forEach(m => {
        if (Array.isArray(m.genre)) {
          m.genre.forEach(g => genres[g] = (genres[g] || 0) + 1);
        }
      });
      const topGenre = Object.entries(genres).sort((a,b) => b[1]-a[1])[0];
      if (topGenre) {
        response += `\n\n🎭 **Tu género favorito:** ${topGenre[0]} (${topGenre[1]} película${topGenre[1] !== 1 ? 's' : ''})`;
      }
    }
  }

  return { response, movies, state };
}


module.exports = {
  processMessage,
  getRecommendationsFromDB,
  parsePreferences,
};
