import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';

import 'izitoast/dist/css/iziToast.min.css';
import iziToast from 'izitoast';

import { fetchImages } from './js/pixabay-api.js';
import {  
  clearGallery, 
  showLoading, 
  hideLoading, 
  displayImages, 
  showNoResultsMessage, 
  showErrorMessage, 
  showLoadMoreButton, 
  hideLoadMoreButton 
} from './js/render-functions.js';

let currentPage = 1;
let currentQuery = '';
let perPage = 15;

document.getElementById('searchButton').addEventListener('click', async () => {
  currentQuery = document.getElementById('searchInput').value.trim();
  if (currentQuery === '') {
    return;
  }

  currentPage = 1;
  perPage = 15; 
  clearGallery();
  hideLoadMoreButton();
  showLoading();

  try {
    const { hits, totalHits } = await fetchImages(currentQuery, currentPage, perPage);
    hideLoading();

    if (hits.length === 0) {
      showNoResultsMessage();
    } else {
      displayImages(hits);
      smoothScrollGallery();
      showLoadMoreButton();
    }
    if (currentPage * perPage >= totalHits) {
      hideLoadMoreButton();
      iziToast.info({
        title: 'End of results',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight'
      });
    }

  } catch (error) {
    hideLoading();
    showErrorMessage(error);
  }
});
function smoothScrollGallery() {
  const galleryItem = document.querySelector('.gallery-item');
  if (!galleryItem) {
    return;
  }
  
  const cardHeight = galleryItem.getBoundingClientRect().height;
  const scrollAmount = cardHeight * 2; // Прокручиваем на высоту двух карточек галереи
  
  window.scrollBy({
    top: scrollAmount,
    behavior: 'smooth'
  });
}
document.getElementById('loadMoreButton').addEventListener('click', async () => {
  currentPage++;
  perPage++;
  showLoading();

  try {
    const { hits, totalHits } = await fetchImages(currentQuery, currentPage, perPage);
    hideLoading();

    if (hits.length === 0) {
      showNoResultsMessage();
    } else {
      displayImages(hits);

      if (currentPage * perPage >= totalHits) {
        hideLoadMoreButton();
        iziToast.info({
          title: 'End of results',
          message: "We're sorry, but you've reached the end of search results.",
          position: 'topRight'
        });
      }
    }
  } catch (error) {
    hideLoading();
    showErrorMessage(error);
  }
});
