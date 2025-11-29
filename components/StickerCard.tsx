import React, { useState } from 'react';
import { Sticker } from '../types';
import { Download, Share2, RefreshCw, Trash2, Check, Eraser, Loader2 } from 'lucide-react';
import { downloadImage, shareImage, removeBackground } from '../utils/imageUtils';

interface StickerCardProps {
  sticker: Sticker;
  onRegenerate: (sticker: Sticker) => void;
  onDelete: (id: string) => void;
  featured?: boolean;
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'wide' | 'tall' | 'circle' | 'oval' | 'hexagon' | 'octagon';
}

const StickerCard: React.FC<StickerCardProps> = ({ 
  sticker, 
  onRegenerate, 
  onDelete, 
  featured = false,
  aspectRatio = 'square'
}) => {
  const [isSharing, setIsSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  
  // Background Removal State
  const [hasRemovedBg, setHasRemovedBg] = useState(false);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessingBg, setIsProcessingBg] = useState(false);

  // Determine which image to show/use
  const currentImage = hasRemovedBg && processedImage ? processedImage : sticker.imageUrl;

  const handleDownload = () => {
    const filename = `sticker-${sticker.theme}-${sticker.id}${hasRemovedBg ? '-transparent' : ''}.png`;
    downloadImage(currentImage, filename);
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const result = await shareImage(currentImage, 'StickerGen AI', `Look at this ${sticker.theme} sticker!`);
      if (result) {
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      }
    } finally {
      setIsSharing(false);
    }
  };

  const toggleBackground = async () => {
    if (hasRemovedBg) {
      // Revert to original
      setHasRemovedBg(false);
    } else {
      // Switch to processed
      if (processedImage) {
        setHasRemovedBg(true);
      } else {
        // Generate processed image
        setIsProcessingBg(true);
        try {
          const newImage = await removeBackground(sticker.imageUrl);
          setProcessedImage(newImage);
          setHasRemovedBg(true);
        } catch (err) {
          console.error("Failed to remove background", err);
        } finally {
          setIsProcessingBg(false);
        }
      }
    }
  };

  // Determine styles for the image container based on shape/aspect ratio
  const getShapeStyles = () => {
    const base = "relative z-10 w-full flex items-center justify-center p-6 overflow-hidden transition-all duration-300";
    
    switch (aspectRatio) {
      case 'square': 
        return { className: `${base} aspect-square` };
      case 'portrait': 
        return { className: `${base} aspect-[3/4]` };
      case 'landscape': 
        return { className: `${base} aspect-[4/3]` };
      case 'wide': 
        return { className: `${base} aspect-video` };
      case 'tall': 
        return { className: `${base} aspect-[9/16]` };
      case 'circle': 
        return { className: `${base} aspect-square rounded-full` };
      case 'oval': 
        return { className: `${base} aspect-[3/4] rounded-[50%]` };
      case 'hexagon': 
        return { 
          className: `${base} aspect-square`, 
          style: { clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' } 
        };
      case 'octagon': 
        return { 
          className: `${base} aspect-square`, 
          style: { clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' } 
        };
      default: 
        return { className: `${base} aspect-square` };
    }
  };

  const shapeStyles = getShapeStyles();

  return (
    <div className={`
      relative group rounded-[2rem] overflow-hidden transition-all duration-300
      ${featured 
        ? 'bg-white shadow-2xl shadow-indigo-200 border-4 border-white transform hover:scale-[1.01]' 
        : 'bg-white shadow-lg hover:shadow-xl border border-slate-100 hover:-translate-y-1'
      }
    `}>
      {/* Background Grid Pattern - Always visible to show transparency when BG is removed */}
      <div className="absolute inset-0 bg-checkerboard opacity-60 z-0"></div>
      
      {/* Card Header (Theme Badge) */}
      <div className="absolute top-3 left-3 z-20">
         <span className={`
           backdrop-blur-md text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border
           ${featured ? 'bg-indigo-600/10 text-indigo-700 border-indigo-200' : 'bg-white/80 text-slate-500 border-slate-200'}
         `}>
           {sticker.theme}
         </span>
      </div>

      {/* Delete Action */}
      <button 
        onClick={(e) => { e.stopPropagation(); onDelete(sticker.id); }}
        className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm opacity-0 group-hover:opacity-100"
      >
        <Trash2 size={14} />
      </button>

      {/* Main Image Area with Shape/Clip Mask */}
      <div 
        className={shapeStyles.className} 
        style={shapeStyles.style}
      >
        {/* Helper div to center image inside clips if needed, though flex does this nicely */}
        <img 
          src={currentImage} 
          alt={sticker.prompt} 
          className="max-w-full max-h-full object-contain drop-shadow-2xl filter transition-transform duration-500 group-hover:scale-110 group-hover:rotate-2"
          style={{ filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.15))' }}
        />
      </div>

      {/* Action Bar */}
      <div className="relative z-20 bg-white/90 backdrop-blur-xl border-t border-slate-100 p-4 flex flex-col gap-3">
        {!featured && (
             <p className="text-sm font-bold text-slate-700 line-clamp-1 text-center" title={sticker.prompt}>
             {sticker.prompt}
           </p>
        )}
        {featured && (
            <p className="text-sm font-bold text-slate-700 line-clamp-1 text-center" title={sticker.prompt}>
            {sticker.prompt}
          </p>
        )}

        <div className="flex items-center justify-center gap-3">
          <ActionButton 
            onClick={handleDownload} 
            icon={<Download size={18} />} 
            label="Save"
            color="hover:bg-blue-50 hover:text-blue-600"
          />
          
          <ActionButton 
            onClick={toggleBackground}
            icon={isProcessingBg ? <Loader2 size={18} className="animate-spin"/> : <Eraser size={18} />}
            label={hasRemovedBg ? "Restore BG" : "Remove BG"}
            active={hasRemovedBg}
            color={hasRemovedBg ? "bg-indigo-100 text-indigo-600" : "hover:bg-indigo-50 hover:text-indigo-600"}
          />

          <ActionButton 
            onClick={handleShare} 
            icon={shareSuccess ? <Check size={18} /> : <Share2 size={18} />} 
            label="Share"
            active={shareSuccess}
            color={shareSuccess ? "bg-green-100 text-green-600" : "hover:bg-green-50 hover:text-green-600"}
          />

          <ActionButton 
            onClick={() => onRegenerate(sticker)} 
            icon={<RefreshCw size={18} />} 
            label="Remix"
            color="hover:bg-purple-50 hover:text-purple-600"
          />
        </div>
      </div>
    </div>
  );
};

// Helper sub-component for buttons
const ActionButton = ({ onClick, icon, label, color, active = false }: any) => (
  <button 
    onClick={onClick}
    className={`
      flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200
      bg-slate-50 text-slate-600 border border-slate-100 shadow-sm
      ${color} ${active ? 'scale-110' : 'hover:scale-110 active:scale-95'}
    `}
    title={label}
  >
    {icon}
  </button>
);

export default StickerCard;