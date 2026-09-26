const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Movie {
  _id: string;
  title: string;
  year: number;
  director: string;
  duration: string;
  genres: string[];
  rate: number;
  poster: string;
}

export interface MoviesResponse {
  movies: Movie[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalMovies: number;
    hasPrev: boolean;
    hasNext: boolean;
  };
}

export async function getMovies(page = 1, limit = 10): Promise<MoviesResponse> {
  const res = await fetch(`${API_BASE}/movies?page=${page}&limit=${limit}`, {
    cache: 'no-store',
  });
  
  if (!res.ok) {
    throw new Error('Error al cargar las películas');
  }
  
  return res.json();
}

export async function getMovieById(id: string): Promise<Movie> {
  const res = await fetch(`${API_BASE}/movies/${id}`, {
    cache: 'no-store',
  });
  
  if (!res.ok) {
    throw new Error('Película no encontrada');
  }
  
  return res.json();
}

export async function createMovie(data: Omit<Movie, '_id'>): Promise<{ message: string; newMovie: Movie }> {
  const res = await fetch(`${API_BASE}/movies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al crear la película');
  }
  
  return res.json();
}

export async function updateMovie(id: string, data: Partial<Movie>): Promise<{ message: string; updatedMovie: Movie }> {
  const res = await fetch(`${API_BASE}/movies/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al actualizar la película');
  }
  
  return res.json();
}

export async function deleteMovie(id: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/movies/${id}`, {
    method: 'DELETE',
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al eliminar la película');
  }
  
  return res.json();
}