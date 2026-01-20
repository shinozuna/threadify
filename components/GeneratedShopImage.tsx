import React from 'react';
import { Package } from 'lucide-react';

interface GeneratedShopImageProps {
  title: string;
  isDark: boolean;
}

const GeneratedShopImage: React.FC<GeneratedShopImageProps> = ({ isDark }) => {
  return (
    <div className={`w-full h-full flex flex-col items-center justify-center gap-4 ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
      <Package className="opacity-10" size={80} strokeWidth={1} />
      <div className="text-[9px] font-black uppercase tracking-[0.4em] opacity-20">Silhouette Preview</div>
    </div>
  );
};

export default GeneratedShopImage;
