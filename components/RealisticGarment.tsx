
import React from 'react';
import { TshirtSVG, HoodieSVG } from './GarmentPaths';

interface RealisticGarmentProps {
  color: string;
  type: 'tshirt' | 'hoodie';
  view: 'front' | 'back';
  baseImage?: string | null;
}

export const RealisticGarment: React.FC<RealisticGarmentProps> = ({ color, type, view, baseImage }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-xl">
      {/* Background layer */}
      <div className="absolute inset-0 z-0">
         <div className="w-full h-full bg-neutral-900/10 backdrop-blur-3xl" />
      </div>

      <div className="relative z-10 w-full h-full p-12 flex items-center justify-center">
         {baseImage ? (
           <div className="relative w-full h-full flex items-center justify-center">
             {/* Use the provided shop/custom image as the base */}
             <img 
               src={baseImage} 
               alt="Garment Silhouette" 
               className="max-w-full max-h-full object-contain drop-shadow-2xl opacity-90 transition-opacity duration-700"
             />
             {/* Dye overlay - subtly tints the product image */}
             <div 
               className="absolute inset-0 mix-blend-color pointer-events-none" 
               style={{ backgroundColor: color }}
             />
           </div>
         ) : (
           /* Default to clean SVG silhouettes if no specific shop image is provided */
           <div className="w-full h-full flex items-center justify-center">
              {type === 'tshirt' ? <TshirtSVG color={color} /> : <HoodieSVG color={color} />}
           </div>
         )}
      </div>

      {/* Professional Fabric Lighting Overlays */}
      <div 
        className="absolute inset-0 z-30 pointer-events-none mix-blend-overlay opacity-20"
        style={{ 
          backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,1) 0%, transparent 80%)'
        }}
      />
      <div 
        className="absolute inset-0 z-30 pointer-events-none mix-blend-multiply opacity-10"
        style={{ 
          backgroundImage: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.5))'
        }}
      />
    </div>
  );
};
