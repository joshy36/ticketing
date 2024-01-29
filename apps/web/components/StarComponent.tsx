'use client';

import { useEffect, useRef } from 'react';

// https://codepen.io/ethancopping/pen/mdaxdEj
const StarComponent = () => {
  const resizeTimeout = useRef(null);

  useEffect(() => {
    return () => {
      // remove stars on unmount
      removeExistingStars();
    };
  }, []);

  useEffect(() => {
    placeRandomStars();

    window.addEventListener('resize', onWindowResize);

    return () => {
      window.removeEventListener('resize', onWindowResize);
    };
  }, []);

  const onWindowResize = () => {
    fadeOutAndAdjustStarPositions();
    // @ts-ignore
    clearTimeout(resizeTimeout.current);
    // @ts-ignore
    resizeTimeout.current = setTimeout(function () {
      removeExistingStars();
      placeRandomStars();
    }, 1000);
  };

  const placeRandomStars = () => {
    // Pixel density: 1 star per 5000 pixels
    const pixelDensity = 10000;

    const bodyWidth = document.body.clientWidth - 2;
    const bodyHeight = document.body.clientHeight - 2;

    const totalPixels = bodyWidth * bodyHeight;

    const numberOfStars = Math.floor(totalPixels / pixelDensity);

    for (let i = 0; i < numberOfStars; i++) {
      const star = document.createElement('div');
      star.classList.add('star');

      const randomX = Math.floor(Math.random() * bodyWidth);
      const randomY = Math.floor(Math.random() * bodyHeight);

      // @ts-ignore
      star.dataset.percentX = randomX / bodyWidth;
      // @ts-ignore
      star.dataset.percentY = randomY / bodyHeight;

      star.style.left = `${randomX}px`;
      star.style.top = `${randomY}px`;

      const pulseDuration = 4 + Math.random() * 8;
      star.style.animation = `pulse ${pulseDuration}s infinite`;

      document.body.appendChild(star);

      void star.offsetWidth;

      // Fade in the star
      setTimeout(() => (star.style.opacity = '1'), 10);
    }
  };

  const fadeOutAndAdjustStarPositions = () => {
    const bodyWidth = document.body.clientWidth - 2;
    const bodyHeight = document.body.clientHeight - 2;

    const existingStars = document.querySelectorAll('.star');
    existingStars.forEach((star: any) => {
      star.style.opacity = '0';

      const adjustedX = star.dataset.percentX * bodyWidth;
      const adjustedY = star.dataset.percentY * bodyHeight;

      star.style.left = `${adjustedX}px`;
      star.style.top = `${adjustedY}px`;
    });
  };

  const removeExistingStars = () => {
    const existingStars = document.querySelectorAll('.star');
    existingStars.forEach((star) => {
      document.body.removeChild(star);
    });
  };

  return null; // This component doesn't render anything itself
};

export default StarComponent;
