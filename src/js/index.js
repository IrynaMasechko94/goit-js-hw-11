const gallery = document.querySelector('.gallery');
const searchForm = document.querySelector('.search-form');
const input = document.querySelector('input[name="searchQuery"]');
const buttonLoadMore = document.querySelector('.load-more');
import Notiflix from 'notiflix';
import { getPhoto } from './api';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { scrollBy } from './scrollFunction';

let currentPage = 1;
let currentHits = 0;
buttonLoadMore.style.display = 'none';
let gallerySimpleLightbox = new simpleLightbox('.gallery a');

searchForm.addEventListener('submit', async event => {
  event.preventDefault();

  cleanGallery();

  let inputText = input.value.trim();

  let photos;

  try {
    photos = await getPhoto(inputText, currentPage);
  } catch (error) {
    console.error('Error fetching photos:', error);
    return;
  }

  if (photos && photos.hits && photos.hits.length > 0) {
    markupPhotos(photos.hits);
  }

  currentHits = photos.hits.length;

  if (currentHits === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else if (currentHits > 0 && currentHits < 40) {
    Notiflix.Notify.success(`Hooray! We found ${photos.totalHits} images.`);
    gallerySimpleLightbox.refresh();
  } else {
    Notiflix.Notify.success(`Hooray! We found ${photos.totalHits} images.`);
    buttonLoadMore.style.display = 'block';
    gallerySimpleLightbox.refresh();
  }
});

buttonLoadMore.addEventListener('click', async () => {
  currentPage += 1;

  let inputText = input.value.trim();

  let photos;

  try {
    photos = await getPhoto(inputText, currentPage);
  } catch (error) {
    console.error('Error fetching photos:', error);
    return;
  }

  if (photos && photos.hits && photos.hits.length > 0) {
    markupPhotos(photos.hits);
  }

  currentHits = photos.hits.length;

  if (currentHits === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else if (currentHits > 0 && currentHits < 40) {
    buttonLoadMore.style.display = 'none';
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
    gallerySimpleLightbox.refresh();
  } else {
    buttonLoadMore.style.display = 'block';
    gallerySimpleLightbox.refresh();
    scrollBy();
  }
});

function cleanGallery() {
  gallery.innerHTML = '';
  pageNumber = 1;
  buttonLoadMore.style.display = 'none';
}

function markupPhotos(array) {
  const markup = array
    .map(
      item =>
        `<div class="photo-card">
         <a href="${item.largeImageURL}"><img class="photo" src="${item.webformatURL}" alt="${item.tags}" title="${item.tags}" loading="lazy" width="350" height="250"/></a> 
            <div class="info">
              <p class="info-item">
                <b>Likes</b> 
                <b>${item.likes}</b>
              </p>
              <p class="info-item">
                <b>Views</b> 
                 <b>${item.views}</b>
              </p>
              <p class="info-item">
                <b>Comments</b> 
                 <b>${item.comments}</b>
              </p>
              <p class="info-item">
                <b>Downloads</b> 
                 <b>${item.downloads}</b>
              </p>
            </div>
          </div>`
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
}
