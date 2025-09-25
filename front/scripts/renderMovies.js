


function renderMovies(movies) {
  const container = document.getElementById("peliculas-container");

  movies.forEach((pelicula) => {
    const card = document.createElement("div");
     card.classList.add("tarjeta"); // <- agregamos la clase

    card.innerHTML = `
      <img src="${pelicula.poster}" /> 
      <h3>${pelicula.title}</h3>
      <p><strong>${pelicula.year}</strong></p>
      <p><strong>${pelicula.director}</strong></p>
      <p><strong>${pelicula.duration}</strong></p>
      <p><strong>${pelicula.genre.join(", ")}</strong></p>
      <p><strong>${pelicula.rate}</strong></p>
    `;

    container.appendChild(card);
  });
};

module.exports=renderMovies;
