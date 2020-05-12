'use strict';

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");

// Don't touch this function please
const autorun = async () => {
  const movies = await fetchMovies();
  console.log(movies)
  renderMovies(movies.results);
};

// Don't touch this function please
const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}`;
};

// You may need to add to this function, definitely don't delete it.
const movieDetails = async (movie) => {
  const movieDetail = await fetchMovie(movie.id);
  const movieCredits = await fetchMovieCredits(movie.id);
  const movieSimilar = await fetchMovieSimilar(movie.id);
  const movieVideos = await fetchMovieVideos(movie.id);

  let actors = movieCredits.cast.slice(0, 5);
  let lang = movieDetail.original_language;
  let similarMovies = movieSimilar.results.slice(0, 7);
  let trailer = movieVideos.results.find(element => {
    return element.type === "Trailer";
  });
  let prodCompanies = movieDetail.production_companies;
  let directors = movieCredits.crew.filter(element => {
    return element.job === "Director";
  });
  let rating = movieDetail.vote_average;
  let voteCount = movieDetail.vote_count;
  let backdropPath = movieDetail.backdrop_path;
  let title = movieDetail.title;
  let releaseDate = movieDetail.release_date;
  let runtime = movieDetail.runtime;
  let overview = movieDetail.overview;

  let movieObj = {
    actors,
    lang,
    similarMovies,
    trailer,
    prodCompanies,
    directors,
    rating,
    voteCount,
    backdropPath,
    title,
    releaseDate,
    runtime,
    overview,
  };

  renderMovie(movieObj);
};

// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchMovies = async () => {
  const url = constructUrl(`movie/now_playing`);
  const res = await fetch(url);
  return res.json();
};

// Don't touch this function please. This function is to fetch one movie.
const fetchMovie = async (movieId) => {
  const url = constructUrl(`movie/${movieId}`);
  const res = await fetch(url);
  return res.json();
};

////
const fetchMovieCredits = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/credits`);
  const res = await fetch(url);
  return res.json();
};

const fetchMovieSimilar = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/similar`);
  const res = await fetch(url);
  return res.json();
};

const fetchMovieVideos = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/videos`);
  const res = await fetch(url);
  return res.json();
};
////

// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
  CONTAINER.innerText = "";
  movies.map((movie) => {
    const movieDiv = document.createElement("div");
    movieDiv.innerHTML = `
        <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${
      movie.title
    } poster">
        <h3>${movie.title}</h3>`;
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    CONTAINER.appendChild(movieDiv);
  });
};



// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movie) => {

  let actorsHTML = movie.actors.map(element => {
    return `
      <div class="actor"> 
        <img src=${BACKDROP_BASE_URL + element.profile_path} height=100em placeholder="Actor photo">
        ${element.name} 
        ${element.character}
      </div>`;
  }).join("\n");

  let prodCompaniesHTML = movie.prodCompanies.map(element => {
    return `
      <p class="production-company"> 
        <img src=${BACKDROP_BASE_URL + element.logo_path} height=25em placeholder="Production Company logo">
        ${element.name} 
      </p>`;
  }).join("\n");

  let similarMoviesHTML = movie.similarMovies.map(element => {
    return `
      <div class="similar-movies"> 
        <img src=${BACKDROP_BASE_URL + element.poster_path} height=100em placeholder="Movie poster">
        ${element.title} 
      </div>`;
  }).join("\n");

  let directorsHTML = movie.directors.map(element => {
    return `
      <p class="directors"> 
        <img src=${BACKDROP_BASE_URL + element.profile_path} height=100em placeholder="Director">
        ${element.name} 
      </p>`;
  }).join("\n");

  let trailerHTML = 
    `<iframe src="https://www.youtube.com/embed/${movie.trailer.key}">
    </iframe>
    `


  CONTAINER.innerHTML = `
    <div class="row">
        <div class="col-md-6">
             <img id="movie-backdrop" src=${BACKDROP_BASE_URL + movie.backdropPath}>
            
        </div>


        <div class="col-md-6">
            <h2 id="movie-title">${movie.title}</h2>

            <p id="movie-release-date"><b>Release Date:</b> ${movie.releaseDate}</p>

            <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
            
            <p id="movie-language"><b>Language:</b> ${movie.lang}</p>

            <p id="movie-rating"><b>Rating:</b> ${movie.rating}</p>

            <p id="movie-vote"><b>Votes:</b> ${movie.voteCount}</p>

            <h3>Overview:</h3>
              <p id="movie-overview">${movie.overview}</p>
        </div>

        <div>${trailerHTML}</div>

        <div class="col-md-12" id="movie-directors">
            <h3>Director(s):</h3> 
            ${directorsHTML}
        </div>

        
        <div class="col-md-12">
            <h3>Actors</h3>
            ${actorsHTML}
        </div>

        <div class="col-md-12">
            <h3>Production Companies</h3>
            ${prodCompaniesHTML}
        </div>

        <div class="col-md-12">
            <h3>Similar Movies</h3>
            ${similarMoviesHTML}
    </div>
    </div>`;
};

////////
const filterMoviesByGenre = (movies, genreId) => {
  return movies.filter(movie => {
    console.log(movie["genre_ids"])
    return movie["genre_ids"].indexOf(genreId) >= 0;
  });
};
////////

document.addEventListener("DOMContentLoaded", autorun);

///////////
let navbarHome = document.getElementById("navbar-home");
navbarHome.addEventListener("click", autorun);

let genreDropdown = document.querySelectorAll("#genre-dropdown .dropdown-item");
genreDropdown.forEach(element => {
  element.addEventListener("click", e => {
    const moviesObj = fetchMovies();
    let genreId = parseInt(element.getAttribute("genre-id"), 10);
    moviesObj.then(obj => filterMoviesByGenre(obj["results"], genreId)).then(renderMovies)
  });
});
///////////