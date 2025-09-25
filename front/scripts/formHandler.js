const form = document.getElementById("movieForm");
const resetBtn = document.getElementById("resetBtn");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = document.getElementById("title").value;
  const year = document.getElementById("year").value;
  const director = document.getElementById("director").value;
  const duration = document.getElementById("duration").value;
  const genreCheckboxes = document.querySelectorAll('#genreCheckboxes input[type="checkbox"]');
  const genres = Array.from(genreCheckboxes).filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);
  const rate = document.getElementById("rate").value;
  const poster = document.getElementById("poster").value;

  if (!title || !year || !director || !duration || !rate || !poster || !genres.length) {
    alert("Todos los campos son obligatorios");
    return;
  }

  const movieData = { title, year, director, duration, genres, rate, poster };

  try {
    await axios.post("http://localhost:3001/movies", movieData);
    alert("Película agregada correctamente");
    form.reset();
  } catch (error) {
    console.error("Fallo al crear la película en AXIOS", error);
  }
});

resetBtn.addEventListener("click", () => {
  form.reset();
});
