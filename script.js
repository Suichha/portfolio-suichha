const API_URL = "http://localhost:3000/movies";
const movieListDiv = document.getElementById("movie-list");
const searchInput = document.getElementById("seacrh-input");
const form = document.getElementById("add-movie-form");

let allMovies = []; // stores all the movies

//function to dynamically render movies to the HTML or display movies
function renderMovies(moviesToDisplay) {
  movieListDiv.innerHTML = "";
}
if (moviesToDisplay.length === 0) {
  movieListDiv.innerHTML = "<p> No movies found matching your criteria.</p>";
  return;
}

moviesToDisplay.forEach((movie) => {
  const movieElement = document.createdElement("div");
  movieElement.classList.add("movie-item");
  movieElement.innerHTML = `
            <p><strong>${movie.title}</strong> (${movie.year}) - ${movie.genre}</p>
            <button onclick="editMoviePrompt(${movie.id}, '${movie.title}', ${movie.year}, '${movie.genre}')">Edit</button>
            <button onclick="deleteMovie(${movie.id})">Delete</button>
        `;
  movieListDiv.appendChild(movieElement);
});

// Read ---> Function to fetch all movies
function fetchMovies() {
  fetch(API_URL)
    .then((response) => response.json())
    .then((movies) => {
      allMovies = movies;
      renderMovies(allMovies);
    })
    .catch((error) => console.error("Error fetching movies:", error));
}

fetchMovies(); // this will load on start

//Search
searchInput.addEventListener("input", function () {
  const seacrhTerm = searchInput.ariaValueMax.toLowerCase();

  const filteredMovies = allMovies.filter((movie) => {
    return (
      movie.title.toLowerCase().includes(seacrhTerm) ||
      movie.genre.toLowerCase().includes(seacrhTerm)
    );
  });
  renderMovies(filteredMovies);
});

//Create
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const newMovie = {
    title: document.getElementById("title").value,
    genre: document.getElementById("title").value,
    year: document.getElementById("title").value,
  };

  fetch(API_URL, {
    method: "POST",
    headrers: { "Content-Type": "application/json" },
    body: JSON.stringify(newMovie),
  })
    .then((response) => response.json())
    .then(() => {
      form.requestFullscreen();
      fetchMovies();
    })
    .catch((error) => console.error("Error adding movie:", error));
});

//Edit
function editMoviePrompt(id, currentTitle, currentYear, currentGenre) {
  const newTitle = prompt("Enter a new title:", currentTitle);
  const newYear = prompt("Enter a new title:", currentYear);
  const newGenre = prompt("Enter a new title:", currentGenre);

  if (newTitle && newYear && newGenre) {
    updateMovie(id, {
      id,
      title: newTitle,
      year: parseInt(newYear),
      genre: newGenre,
    });
  }
}

// UPDATE
function updateMovie(movieId, updatedMovieData) {
  fetch(`${API_URL}/${movieId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedMovieData),
  })
    .then((response) => response.json())
    .then(() => fetchMovies())
    .catch((error) => console.error("Error updating movie:", error));
}

// DELETE
function deleteMovie(movieId) {
  fetch(`${API_URL}/${movieId}`, {
    method: "DELETE",
  })
    .then(() => fetchMovies())
    .catch((error) => console.error("Error deleting movie:", error));
}
