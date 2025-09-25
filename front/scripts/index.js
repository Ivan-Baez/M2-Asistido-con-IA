
const renderMovies = require("./renderMovies");
const axios = require("axios")


// function getMovies() {
//   const loader = document.getElementById("loader");

//   $.get("https://students-api.up.railway.app/movies", function (data) {
//     console.log(data);
//     renderMovies(data);
//     loader.style.display = "none"; // Oculta el loader después de renderizar
//   });
// }

// getMovies();

//VERSION ASYNC AWAIT
async function getMovies() {
  const loader = document.getElementById("loader");

  
  try {
    const response = await axios.get('http://localhost:3001/movies');
    loader.style.display="none"
    renderMovies(response.data)
  } catch (error) {
    console.error(error);
    loader.style.display="none"
    alert("Fallo el servidor",error)
  }

}

getMovies();

// VERSION PROMESAS
// async function getMovies() {
//   const loader = document.getElementById("loader");

// axios.get('https://students-api.up.railway.app/movies')
//   .then(function (response) {
//     // handle success
//     loader.style.display="none"
//     renderMovies(response.data)
//   })
//   .catch(function (error) {
//     // handle error
    
//     loader.style.display="none"
//     alert("Fallo el servidor",error)
//   })
 
  
  

// }

// getMovies();
