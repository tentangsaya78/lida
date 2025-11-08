import './style.css'
import data from './data.json' assert { type: 'json' }

import Splide from '@splidejs/splide';
import '@splidejs/splide/css';
import '@splidejs/splide/css/core';

import Alpine from 'alpinejs'

window.Alpine = Alpine

document.addEventListener('alpine:init', () => {
  Alpine.data('dataContent', () => ({
    data: data,
    init() {
      console.log(data)
    }
  }))
})


document.addEventListener('alpine:initialized', () => {
  const homeSlider = new Splide('#homeSlider', {
    type: 'loop',
    perPage: 1,
    autoplay: true,  // huruf kecil semua
    interval: 3000,
    speed: 1500,
    arrows: false,
    pagination: true,
    pauseOnHover: false,
    pauseOnFocus: false,
  });

  // Progress bar handler
  homeSlider.on('mounted move', function () {
    const end = homeSlider.Components.Controller.getEnd() + 1;
    const rate = Math.min((homeSlider.index + 1) / end, 1);
    const bar = homeSlider.root.querySelector('.splide__progress__bar');
    if (bar) {
      bar.style.width = String(100 * rate) + '%';
    }
  });

  homeSlider.mount();
});

Alpine.start()
