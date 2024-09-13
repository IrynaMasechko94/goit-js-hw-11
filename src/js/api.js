import axios from 'axios';

const URL = 'https://pixabay.com/api/?key=45931366-0fcfb6a165914a47110afcc4c';

export function getPhoto(data, page) {
  return axios
    .get(
      `${URL}&q=${data}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
    )
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error('Error fetching data:', error);
    });
}
