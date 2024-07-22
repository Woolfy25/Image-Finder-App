const form = document.querySelector('#search-form');
const input = document.querySelector('input');
const submitButton = document.querySelector('#submit');
const loadMore = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

const KEY = '44948375-490a2b5531ef23b5637f1620a';
const BASE_URL = `https://pixabay.com/api/?key=${KEY}&image_type=photo&orientation=horizontal&per_page=12`;
let page = 1;
let query = '';
let totalHits = 0;
let imagesLoaded = 0;
loadMore.style.display = 'none';

const createPhotoCard = image => {
  const photoCard = document.createElement('div');
  photoCard.className = 'ImageGalleryItem';

  const link = document.createElement('a');
  link.href = image.largeImageURL;
  link.className = 'photo-link';

  const img = document.createElement('img');
  img.src = image.webformatURL;
  img.alt = image.tags;
  img.loading = 'lazy';
  img.className = 'ImageGalleryItemImage';

  const info = document.createElement('div');
  info.className = 'info';

  const likesItem = document.createElement('p');
  likesItem.className = 'info-item';
  likesItem.innerHTML = `<b>Likes:</b> ${image.likes}`;

  const viewsItem = document.createElement('p');
  viewsItem.className = 'info-item';
  viewsItem.innerHTML = `<b>Views:</b> ${image.views}`;

  const commentsItem = document.createElement('p');
  commentsItem.className = 'info-item';
  commentsItem.innerHTML = `<b>Comments:</b> ${image.comments}`;

  const downloadsItem = document.createElement('p');
  downloadsItem.className = 'info-item';
  downloadsItem.innerHTML = `<b>Downloads:</b> ${image.downloads}`;

  info.appendChild(likesItem);
  info.appendChild(viewsItem);
  info.appendChild(commentsItem);
  info.appendChild(downloadsItem);

  link.appendChild(img);
  photoCard.appendChild(link);
  photoCard.appendChild(info);

  return photoCard;
};

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
      loadMore.style.display = 'none';
    } else {
      const images = response.data.hits;
      images.forEach(image => {
        const photoCard = createPhotoCard(image);
        gallery.appendChild(photoCard);
      });
      totalHits = response.data.totalHits;
      imagesLoaded += images.length;

      if (imagesLoaded >= totalHits) {
        loadMore.style.display = 'none';
        Notiflix.Notify.failure(
          'We`re sorry, but youve reached the end of search results.'
        );
      } else {
        loadMore.style.display = 'block';
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      }
      let lightbox = new SimpleLightbox('.gallery a', {});
      lightbox.refresh();
    }
  } catch (error) {
    Notiflix.Notify.failure(`Error: ${error.message}`);
  }
};

form.addEventListener('submit', event => {
  event.preventDefault();
  query = input.value;
  page = 1;
  imagesLoaded = 0;
  gallery.innerHTML = '';
  fetchImages();
});

loadMore.addEventListener('click', () => {
  page += 1;
  fetchImages();
});
