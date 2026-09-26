class MovieDTO {
  constructor(movie) {
    this._id = movie._id;
    this.title = movie.title;
    this.year = movie.year;
    this.director = movie.director;
    this.duration = movie.duration;
    this.genres = Array.isArray(movie.genres) ? movie.genres : [];
    this.rate = movie.rate;
    this.poster = movie.poster;
  }

  static fromArray(movies) {
    return movies.map(movie => new MovieDTO(movie));
  }
}

module.exports = MovieDTO;