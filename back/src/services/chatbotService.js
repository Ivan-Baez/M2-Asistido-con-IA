const Movie = require("../models/movieModel");

const CINEMA_KNOWLEDGE = {
  history: {
    keywords: ['historia', 'origen', 'inicio', 'primer', 'nacimiento', 'lumiere', 'lumiére', '1895', 'cinematografo', 'cinematógrafo'],
    responses: [
      'El cine nació el 28 de diciembre de 1895, cuando los hermanos Lumière realizaron la primera proyección pública en el Salón Indio del Gran Café de París.',
      'El cinematógrafo de los Lumière no solo proyectaba, sino que también filmaba y copiaba. Fue la primera cámara todo en uno.',
      'Antes del cinematógrafo existieron el taumatropo, el zoótropo, la linterna mágica y el fusil fotográfico de Marey.',
      'Georges Méliès, ilusionista, descubrió los efectos especiales por accidente y creó "Viaje a la Luna" (1902), la primera película de ciencia ficción.'
    ]
  },
  silentEra: {
    keywords: ['mudo', 'silencioso', 'charlot', 'chaplin', 'buster keaton', 'harold lloyd', 'nosferatu', 'metropolis', 'el gabinete del doctor caligari'],
    responses: [
      'La era del cine mudo (1895-1927) fue pura narración visual. Chaplin, Keaton y Lloyd dominaron la comedia física.',
      '"El gabinete del doctor Caligari" (1920) inició el expresionismo alemán con sus decorados distorsionados.',
      '"Metrópolis" (1927) de Fritz Lang es la piedra angular del sci-fi cinematográfico.',
      'Los actores mudos usaban maquillaje exagerado y gestos amplios para compensar la falta de diálogo.'
    ]
  },
  soundEra: {
    keywords: ['sonoro', 'sonido', 'el cantor de jazz', 'talkies', 'vitaphone', '1927', 'warner bros'],
    responses: [
      '"El cantor de jazz" (1927) de Alan Crosland fue el primer largometraje con diálogos sincronizados (sistema Vitaphone).',
      'La llegada del sonido acabó con muchas carreras de actores mudos cuyas voces no "encajaban".',
      'Los primeros musicales como "Broadway Melody" (1929) explotaron la novedad del sonido.'
    ]
  },
  color: {
    keywords: ['color', 'technicolor', 'tecnicolor', 'magia del technicolor', 'lo que el viento se llevo'],
    responses: [
      'El Technicolor de 3 tiras (1932) dominó el color hasta los 50. "Lo que el viento se llevó" (1939) y "El mago de Oz" (1939) son sus cumbres.',
      'Antes hubo Kinemacolor (aditivo) y Technicolor de 2 colores (sustractivo, usado en "La culpa del otro" 1922).',
      'Eastmancolor (1950) abaratizó el color y acabó con el monopolio Technicolor.'
    ]
  },
  genres: {
    keywords: ['genero', 'género', 'terror', 'horror', 'noir', 'western', 'musical', 'ciencia ficcion', 'ciencia ficción', 'sci-fi', 'fantasia', 'fantasía', 'animacion', 'animación', 'documental', 'thriller', 'suspenso', 'accion', 'acción', 'comedia', 'drama', 'romance'],
    responses: [
      'El film noir (40-50) usa iluminación de alto contraste, femme fatale y detective cínico. Claves: "El halcón maltés", "Perdición".',
      'El western define la mitología americana. Ford ("Centauros del desierto"), Leone ("El bueno, el feo y el malo").',
      'El terror evoluciona: Universal Monsters (30), Hammer (50-70), Slasher (70-80), J-horror (90), Elevated horror (2010+).',
      'La Nueva Hollywood (67-80) rompió el estudio system: Coppola, Scorsese, Spielberg, De Palma, Lucas.'
    ]
  },
  directors: {
    keywords: ['director', 'directora', 'auteur', 'hitchcock', 'kubrick', 'spielberg', 'scorsese', 'copola', 'nolan', 'tarantino', 'villeneuve', 'wes anderson', 'almodovar', 'almodóvar', 'miyazaki', 'ghibli', 'fellini', 'bergman', 'truffaut', 'godard'],
    responses: [
      'Hitchcock ("El maestro del suspenso"): MacGuffin, cameo, rubias gélidas, escalera. "Vértigo", "Psicosis", "La ventana indiscreta".',
      'Kubrick: Perfeccionismo obsesivo, simetría, lentes NASA (Barry Lyndon), géneros reinventados. "2001", "La naranja mecánica", "El resplandor".',
      'Spielberg: Blockbuster moderno ("Tiburón", "E.T."), virtuosismo técnico, sentido del asombro. También drama histórico ("La lista de Schindler").',
      'Ghibli/Miyazaki: Animación artesanal, ecologismo, feminidad, vuelos. "El viaje de Chihiro", "Mi vecino Totoro", "Princesa Mononoke".'
    ]
  },
  techniques: {
    keywords: ['plano', 'secuencia', 'montaje', 'edicion', 'edición', 'kuleshov', 'eisenstein', ' Griffith', 'dolly', 'zoom', 'steadycam', 'travelling', 'plano secuencia', 'long take', 'birdman', '1917'],
    responses: [
      'Efecto Kuleshov (Lev Kuleshov, 1918): El significado de un plano cambia según el que le precede/sigue. Base del montaje.',
      'Montaje soviético (Eisenstein): Colisión de planos para crear significado nuevo. "El acorazado Potemkin" (escalera de Odesa).',
      'Plano secuencia: Tiempo real sin cortes. Ejemplos: "La soga" (Hitchcock), "Birdman" (Iñárritu), "1917" (Mendes - simula un solo plano).',
      'Dolly zoom / Vertigo zoom: Acercar objetivo mientras alejas cámara (o viceversa). Efecto vértigo. Hitchcock en "Vértigo", Spielberg en "Tiburón".'
    ]
  },
  awards: {
    keywords: ['oscar', 'premio', 'academy', 'cannes', 'palma de oro', 'venecia', 'leon de oro', 'león de oro', 'berlin', 'oso de oro', 'globo de oro', 'bafta', 'goya'],
    responses: [
      'Los Oscar (desde 1929) premian a la industria estadounidense. "Todo sobre mi madre" (Almodóvar) y "Parásitos" (Bong Joon-ho) rompieron barreras de idioma.',
      'Cannes (Palma de Oro) es el festival de autor por excelencia. Ganadores: "Pulp Fiction", "El árbol de la vida", "Titane", "Anora".',
      'Venecia (León de Oro) es el festival más antiguo (1932). "Roma", "Joker", "Poor Things" ganaron recientemente.'
    ]
  }
};

function findMatchingCategory(message) {
  const lower = message.toLowerCase();
  for (const [category, data] of Object.entries(CINEMA_KNOWLEDGE)) {
    for (const keyword of data.keywords) {
      if (lower.includes(keyword.toLowerCase())) {
        return category;
      }
    }
  }
  return null;
}

function getRandomResponse(category) {
  const responses = CINEMA_KNOWLEDGE[category]?.responses || [
    'Esa es una gran pregunta cinematográfica. ¿Te interesa saber sobre historia del cine, directores, géneros, técnicas o premios?'
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

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
    return 'No encontré películas que coincidan exactamente. ¿Quieres que amplíe la búsqueda?';
  }
  
  let response = `🎬 **Recomendaciones para ti:**\n\n`;
  movies.forEach((m, i) => {
    response += `${i + 1}. **${m.title}** (${m.year})\n`;
    response += `   🎭 ${m.genre.join(', ')} | ⭐ ${m.rate}/10 | 🎬 ${m.director}\n`;
    response += `   ⏱ ${m.duration}\n\n`;
  });
  response += '¿Quieres más detalles de alguna o buscas algo diferente?';
  return response;
}

async function processMessage(userMessage, userMovies = []) {
  const lower = userMessage.toLowerCase();
  
  const wantsRecommendation = /recomienda|recomendación|sugiere|que ver|qué ver|busco|buscar|pelicula|película|ver algo|similar a|parecida a/.test(lower);
  const wantsKnowledge = /que es|qué es|quien es|quién es|como se|cómo se|cuando|cuándo|donde|dónde|por que|por qué|explica|explícame|dime|cuentame|cuéntame/.test(lower);
  
  let response = '';
  let movies = [];
  
  if (wantsRecommendation) {
    const preferences = parsePreferences(userMessage);
    movies = await getRecommendationsFromDB(preferences);
    response = formatRecommendations(movies);
  } else if (wantsKnowledge) {
    const category = findMatchingCategory(userMessage);
    if (category) {
      response = getRandomResponse(category);
    } else {
      response = 'Esa es una interesante pregunta sobre cine. ¿Podrías ser más específico? Puedo hablar de historia del cine, directores, géneros, técnicas de filmación, premios, etc.';
    }
  } else {
    const greetings = /hola|buenas|hey|buenos dias|buenos días|buenas tardes|buenas noches/.test(lower);
    const thanks = /gracias|thx|thanks/.test(lower);
    const bye = /adios|adiós|chao|hasta luego|nos vemos/.test(lower);
    
    if (greetings) {
      response = '¡Hola! 🎬 Soy tu asistente cinematográfico. ¿En qué te ayudo hoy?\n\n• **Recomendaciones**: "Recomiéndame una de terror de los 80"\n• **Preguntas**: "¿Qué es el film noir?", "¿Quién dirigió Vértigo?"\n• **Tu catálogo**: "¿Cuál es mi película mejor valorada?"';
    } else if (thanks) {
      response = '¡De nada! 🍿 Disfruta de la película. ¿Algo más en lo que te ayude?';
    } else if (bye) {
      response = '¡Hasta la próxima! 🎥 Que tengas una buena sesión de cine.';
    } else {
      response = 'No estoy seguro de entender. ¿Buscas una **recomendación** o tienes una **pregunta** sobre cine?\n\nEjemplos:\n• "Recomiéndame ciencia ficción > 8.5"\n• "¿Qué es el plano secuencia?"\n• "Películas de Nolan después de 2010"';
    }
  }
  
  if (userMovies.length > 0 && /mi catalogo|mi catálogo|mis peliculas|mis películas|tengo/.test(lower)) {
    const topRated = [...userMovies].sort((a, b) => b.rate - a.rate).slice(0, 3);
    response += '\n\n📊 **Tu top 3 personal:**\n';
    topRated.forEach((m, i) => {
      response += `${i + 1}. ${m.title} (${m.year}) - ⭐ ${m.rate}/10\n`;
    });
  }
  
  return { response, movies };
}

module.exports = {
  processMessage,
  getRecommendationsFromDB,
  parsePreferences,
  CINEMA_KNOWLEDGE
};