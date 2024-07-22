const form = document.querySelector('#search-form');
const input = document.querySelector('input');
const submitButton = document.querySelector('#submit');

const KEY = '44948375-490a2b5531ef23b5637f1620a';
const BASE_URL = `https://pixabay.com/api/?key=${KEY}&image_type=photo&orientation=horizontal&per_page=12`;
let page = 1;
let query = '';

const fetchImages = async () => {
  const URL = `${BASE_URL}&q=${query}&page=${page}`;
  try {
    const response = await axios.get(URL);
    if (response.status !== 200) {
      throw new Error('Network response was not ok');
    }
    if (response.data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      return console.log(response.data.hits);
    }
  } catch (error) {
    Notiflix.Notify.failure(`Error: ${error.message}`);
  }
};

form.addEventListener('submit', event => {
  event.preventDefault();
  query = input.value;
  page = 1;
  fetchImages();
});
