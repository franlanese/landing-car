import React from 'react';
import './OverlappingImages.css';

interface OverlappingImagesProps {
  imageFront: string;
  imageBack: string;
}

export const OverlappingImages: React.FC<OverlappingImagesProps> = ({ imageFront, imageBack }) => {
  return (
    <div className="overlapping-images-container">
      <div className="image-wrapper back">
        <img src={imageBack} alt="Imagen de fondo" />
      </div>
      <div className="image-wrapper front">
        <img src={imageFront} alt="Imagen superpuesta" />
      </div>
    </div>
  );
};
