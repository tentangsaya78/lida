import './style.css'
import data from './data.json' assert { type: 'json' }

import Splide from '@splidejs/splide';
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
    autoplay: true,
    interval: 3000,
    speed: 1500,
    arrows: false,
    pagination: true,
    pauseOnHover: false,
    pauseOnFocus: false,
  });

  let progressInterval = null;

  function startProgress() {
    // Clear interval sebelumnya
    if (progressInterval) {
      clearInterval(progressInterval);
      progressInterval = null;
    }

    // Reset semua bullet progress
    const bullets = homeSlider.root.querySelectorAll('.splide__pagination__page');
    bullets.forEach(bullet => {
      bullet.style.setProperty('--progress', '0deg');
    });

    // Get active bullet
    const activeBullet = homeSlider.root.querySelector('.splide__pagination__page.is-active');
    
    if (activeBullet) {
      let progress = 0;
      const duration = 3000; // Sama dengan interval
      const steps = 60;
      const increment = 360 / (duration / (1000 / steps));

      progressInterval = setInterval(() => {
        progress += increment;
        
        if (progress >= 360) {
          progress = 360;
          clearInterval(progressInterval);
          progressInterval = null;
        }
        
        const currentActiveBullet = homeSlider.root.querySelector('.splide__pagination__page.is-active');
        if (currentActiveBullet) {
          currentActiveBullet.style.setProperty('--progress', `${progress}deg`);
        }
      }, 1000 / steps);
    }
  }

  // Jalankan progress saat mounted
  homeSlider.on('mounted', function () {
    startProgress();
    
    // Progress bar handler (jika masih digunakan)
    const end = homeSlider.Components.Controller.getEnd() + 1;
    const rate = Math.min((homeSlider.index + 1) / end, 1);
    const bar = homeSlider.root.querySelector('.splide__progress__bar');
    if (bar) {
      bar.style.width = String(100 * rate) + '%';
    }
  });

  // Restart progress saat slide berpindah
  homeSlider.on('move', function () {
    startProgress();
    
    // Progress bar handler (jika masih digunakan)
    const end = homeSlider.Components.Controller.getEnd() + 1;
    const rate = Math.min((homeSlider.index + 1) / end, 1);
    const bar = homeSlider.root.querySelector('.splide__progress__bar');
    if (bar) {
      bar.style.width = String(100 * rate) + '%';
    }
  });

  // Pause progress saat autoplay di-pause
  homeSlider.on('autoplay:pause', function() {
    if (progressInterval) {
      clearInterval(progressInterval);
      progressInterval = null;
    }
  });

  // Resume progress saat autoplay di-play
  homeSlider.on('autoplay:play', function() {
    startProgress();
  });

  homeSlider.mount();
});

Alpine.start()
