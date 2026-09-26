function getGenreClass(genre) {
  const genreLower = genre.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const genreClassMap = {
    'action': 'action',
    'adventure': 'adventure',
    'comedy': 'comedy',
    'fantasy': 'fantasy',
    'sci-fi': 'sci-fi',
    'drama': 'drama',
    'horror': 'horror',
    'thriller': 'thriller',
    'romance': 'romance',
    'animation': 'animation',
    'mystery': 'mystery',
    'crime': 'crime',
    'documentary': 'documentary',
    'family': 'family',
    'music': 'music',
    'war': 'war',
    'western': 'western',
    'history': 'history',
    'biography': 'biography',
    'musical': 'musical',
    'accion': 'action',
    'aventura': 'adventure',
    'comedia': 'comedy',
    'fantasia': 'fantasy',
    'ciencia-ficcion': 'sci-fi',
    'terror': 'horror',
    'suspenso': 'thriller',
    'romance': 'romance',
    'animacion': 'animation',
    'misterio': 'mystery',
    'crimen': 'crime',
    'documental': 'documentary',
    'familia': 'family',
    'musica': 'music',
    'guerra': 'war',
    'western': 'western',
    'historia': 'history',
    'biografia': 'biography',
    'musical': 'musical'
  };
  return genreClassMap[genreLower] || '';
}

function renderMovies(movies) {
  const container = document.getElementById("peliculas-container");

  movies.forEach((pelicula) => {
    const card = document.createElement("div");
    card.classList.add("tarjeta");

    const genres = Array.isArray(pelicula.genres) ? pelicula.genres : 
                   (pelicula.genre ? [pelicula.genre] : []);
    const genresHtml = genres.length > 0 
      ? genres.map(g => `<span class="genre-tag ${getGenreClass(g)}">${g}</span>`).join(" ")
      : '<span class="genre-tag">Sin género</span>';

    card.innerHTML = `
      <img src="${pelicula.poster}" alt="${pelicula.title}" /> 
      <h3>${pelicula.title}</h3>
      <p><strong>Año:</strong> ${pelicula.year}</p>
      <p><strong>Director:</strong> ${pelicula.director}</p>
      <p><strong>Duración:</strong> ${pelicula.duration}</p>
      <p><strong>Géneros:</strong> ${genresHtml}</p>
      <p><strong>Puntaje:</strong> ${pelicula.rate}</p>
    `;

    container.appendChild(card);
  });
};

module.exports = renderMovies;