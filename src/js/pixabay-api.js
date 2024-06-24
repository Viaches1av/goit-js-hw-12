import axios from 'axios';

export async function fetchImages(query, page = 1, perPage = 15) {
  const API_KEY = '44391753-f60266e3ce72fa57ae00baec0';
  const BASE_URL = 'https://pixabay.com/api/';

  const url = `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&pretty=true&per_page=${perPage}&page=${page}`;

  try {
    const response = await axios.get(url);

    return {
      hits: response.data.hits,
      totalHits: response.data.totalHits 
    }
  } catch (error) {
    throw error;
  }
}

