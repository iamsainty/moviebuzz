const API_KEY = process.env.EXPO_PUBLIC_OMDB_API_KEY;

export const fetchMoviesByTitle = async (title, page = 1) => {
  try {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&s=${title}&page=${page}`
    );
    const data = await response.json();
    return data?.Search || [];
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
};

export const fetchMovieDetails = async (imdbID) => {
  try {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}&plot=full`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
};
