class CreateMovieDTO {
  constructor(data) {
    this.title = data.title;
    this.year = parseInt(data.year);
    this.director = data.director;
    this.duration = data.duration;
    this.genres = Array.isArray(data.genres) ? data.genres : [];
    this.rate = parseFloat(data.rate);
    this.poster = data.poster;
  }

  validate() {
    const errors = [];
    
    if (!this.title || this.title.trim() === '') {
      errors.push('Title is required');
    }
    
    if (!this.year || isNaN(this.year) || this.year < 1888 || this.year > new Date().getFullYear() + 5) {
      errors.push('Valid year is required');
    }
    
    if (!this.director || this.director.trim() === '') {
      errors.push('Director is required');
    }
    
    if (!this.duration || this.duration.trim() === '') {
      errors.push('Duration is required');
    }
    
    if (!this.genres || this.genres.length === 0) {
      errors.push('At least one genre is required');
    }
    
    if (!this.rate || isNaN(this.rate) || this.rate < 0 || this.rate > 10) {
      errors.push('Rate must be between 0 and 10');
    }
    
    if (!this.poster || this.poster.trim() === '') {
      errors.push('Poster URL is required');
    }
    
    return errors;
  }
}

module.exports = CreateMovieDTO;