// Carousel.js
import React from 'react';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

import image1 from '../assets/img/match1.webp';
import image2 from '../assets/img/match1.webp';
import image3 from '../assets/img/match1.webp';
const images = [
  {
    original: image1,
    thumbnail: image1,
  },
  {
    original: image2,
    thumbnail: image2,
  },
  {
    original: image3,
    thumbnail: image3,
  }
];

const Carousel = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-2/3">
        <ImageGallery items={images} showThumbnails={false} />
      </div>
    </div>
  );
};

export default Carousel;
