
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { RealisticGarment } from './RealisticGarment';
import { CustomizationState, COLORS, SIZES, FONTS, GarmentType, ViewType, INITIAL_DESIGN, DesignData, CartItem } from '../types';
import { 
  Upload, ShoppingBag, Type, Maximize2, ZoomIn, ZoomOut, Undo2, Redo2, Check, 
  RotateCw, Scale, Trash2, ChevronLeft, ChevronRight, Layers, ImageIcon,
  Grid3X3
} from 'lucide-react';

interface CustomizerProps {
  isDark: boolean;
  onAddToCart: (item: CartItem) => void;
  editItem?: CartItem | null;
}

const Customizer: React.FC<CustomizerProps> = ({ isDark, onAddToCart, editItem }) => {
  const [state, setState] = useState<CustomizationState>({
    garmentType: 'tshirt',
    color: COLORS[1],
    size: 'M',
    view: 'front',
    frontDesign: { ...INITIAL_DESIGN },
    backDesign: { ...INITIAL_DESIGN },
    baseImageFront: null,
    baseImageBack: null
  });

  const [showGrid, setShowGrid] = useState(false);
  const [history, setHistory] = useState<CustomizationState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const skipHistoryRef = useRef(false);

  const [activeLayer, setActiveLayer] = useState<'base' | 'image' | 'text'>('base');
  const [interactionMode, setInteractionMode] = useState<'drag' | 'rotate' | 'resize' | null>(null);
  
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const currentDesign = state.view === 'front' ? state.frontDesign : state.backDesign;

  useEffect(() => {
    const initial: CustomizationState = editItem ? {
      ...editItem
    } : {
      garmentType: 'tshirt',
      color: COLORS[1],
      size: 'M',
      view: 'front',
      frontDesign: { ...INITIAL_DESIGN },
      backDesign: { ...INITIAL_DESIGN },
      baseImageFront: null,
      baseImageBack: null
    };
    setState(initial);
    setHistory([initial]);
    setHistoryIndex(0);
  }, [editItem]);

  const saveToHistory = (newState: CustomizationState) => {
    if (skipHistoryRef.current) { skipHistoryRef.current = false; return; }
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      return [...newHistory, newState];
    });
    setHistoryIndex(prev => prev + 1);
  };

  const updateStateAndHistory = (updates: Partial<CustomizationState> | ((prev: CustomizationState) => CustomizationState)) => {
    setState(prev => {
      const newState = typeof updates === 'function' ? updates(prev) : { ...prev, ...updates };
      saveToHistory(newState);
      return newState;
    });
  };

  const updateCurrentDesign = (updates: Partial<DesignData>, recordHistory = false) => {
    const key = state.view === 'front' ? 'frontDesign' : 'backDesign';
    const newDesign = { ...state[key], ...updates };
    const newState = { ...state, [key]: newDesign };
    if (recordHistory) {
      updateStateAndHistory(newState);
    } else {
      setState(newState);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateCurrentDesign({ image: event.target?.result as string }, true);
        setActiveLayer('image');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInteractionStart = (e: React.MouseEvent | React.TouchEvent, layer: 'image' | 'text', mode: 'drag') => {
    e.stopPropagation();
    setActiveLayer(layer);
    setInteractionMode(mode);

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    if (mode === 'drag') {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const pos = layer === 'image' ? currentDesign.imagePosition : currentDesign.textPosition;
        const screenX = rect.left + (pos.x / 100) * rect.width;
        const screenY = rect.top + (pos.y / 100) * rect.height;
        setDragOffset({ x: clientX - screenX, y: clientY - screenY });
      }
    }
  };

  const handleInteractionMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!containerRef.current || !interactionMode) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    if (interactionMode === 'drag') {
      const rect = containerRef.current.getBoundingClientRect();
      const newX = ((clientX - dragOffset.x - rect.left) / rect.width) * 100;
      const newY = ((clientY - dragOffset.y - rect.top) / rect.height) * 100;
      updateCurrentDesign({
        [activeLayer === 'image' ? 'imagePosition' : 'textPosition']: { x: Math.max(0, Math.min(100, newX)), y: Math.max(0, Math.min(100, newY)) }
      });
    }
  }, [interactionMode, dragOffset, activeLayer]);

  const handleInteractionEnd = () => {
    if (interactionMode) saveToHistory(state);
    setInteractionMode(null);
  };

  useEffect(() => {
    if (interactionMode) {
      window.addEventListener('mousemove', handleInteractionMove);
      window.addEventListener('mouseup', handleInteractionEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleInteractionMove);
      window.removeEventListener('mouseup', handleInteractionEnd);
    };
  }, [interactionMode, handleInteractionMove]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
      {/* CANVAS VIEW */}
      <div className="lg:sticky lg:top-32 space-y-10 animate-fade-in">
        <div ref={containerRef} className={`relative aspect-[4/5] ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-black/5'} border-2 rounded-[50px] overflow-hidden flex items-center justify-center shadow-2xl`}>
          
          {/* PRECISION GRID OVERLAY */}
          {showGrid && (
            <div className="absolute inset-0 z-50 pointer-events-none opacity-20 transition-opacity">
              <div className="w-full h-full" style={{ 
                backgroundImage: `
                  linear-gradient(to right, ${isDark ? '#fff' : '#000'} 1px, transparent 1px),
                  linear-gradient(to bottom, ${isDark ? '#fff' : '#000'} 1px, transparent 1px)
                `,
                backgroundSize: '10% 10%'
              }} />
              <div className="absolute inset-y-0 left-1/2 w-px bg-blue-500 opacity-100" />
              <div className="absolute inset-x-0 top-1/2 h-px bg-blue-500 opacity-100" />
            </div>
          )}

          <div className="w-full h-full relative flex items-center justify-center" style={{ transform: `scale(${zoomLevel})` }}>
            <RealisticGarment 
               color={state.color.hex} 
               type={state.garmentType} 
               view={state.view} 
               baseImage={state.view === 'front' ? state.baseImageFront : state.baseImageBack} 
            />

            {/* DESIGN OVERLAYS */}
            {currentDesign.image && (
              <div 
                onMouseDown={(e) => handleInteractionStart(e, 'image', 'drag')}
                className={`absolute cursor-move select-none ${activeLayer === 'image' ? 'z-20 ring-2 ring-blue-500' : 'z-10'}`}
                style={{
                  left: `${currentDesign.imagePosition.x}%`, top: `${currentDesign.imagePosition.y}%`,
                  transform: `translate(-50%, -50%) scale(${currentDesign.imageScale}) rotate(${currentDesign.imageRotation}deg)`,
                  maxWidth: '50%'
                }}
              >
                <img src={currentDesign.image} className="pointer-events-none drop-shadow-2xl mix-blend-multiply" />
              </div>
            )}

            {currentDesign.text && (
              <div 
                onMouseDown={(e) => handleInteractionStart(e, 'text', 'drag')}
                className={`absolute cursor-move select-none p-4 ${activeLayer === 'text' ? 'z-20 ring-2 ring-blue-500' : 'z-10'}`}
                style={{
                  left: `${currentDesign.textPosition.x}%`, top: `${currentDesign.textPosition.y}%`,
                  transform: `translate(-50%, -50%) scale(${currentDesign.textScale}) rotate(${currentDesign.textRotation}deg)`,
                  color: currentDesign.textColor, fontFamily: currentDesign.textFont, fontSize: '2rem', fontWeight: '900',
                  whiteSpace: 'nowrap', mixBlendMode: 'multiply', opacity: 0.85
                }}
              >
                {currentDesign.text}
              </div>
            )}
          </div>

          <div className="absolute bottom-8 inset-x-8 flex justify-between items-center bg-black/80 backdrop-blur-xl p-4 rounded-3xl border border-white/10 z-[60]">
             <button onClick={() => setShowGrid(!showGrid)} className={`p-2.5 rounded-xl transition-all ${showGrid ? 'bg-blue-600 text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}>
               <Grid3X3 size={18} />
             </button>
             <div className="flex gap-2">
               <button onClick={() => setZoomLevel(p => Math.max(1, p - 0.25))} className="p-2.5 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-colors"><ZoomOut size={18} /></button>
               <button onClick={() => setZoomLevel(p => Math.min(2.5, p + 0.25))} className="p-2.5 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-colors"><ZoomIn size={18} /></button>
             </div>
          </div>
        </div>
        <div className="flex justify-center gap-6">
          {(['front', 'back'] as ViewType[]).map(v => (
            <button key={v} onClick={() => setState({ ...state, view: v })} className={`px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${state.view === v ? 'bg-blue-600 text-white shadow-xl' : 'bg-current/5 opacity-40'}`}>{v} VIEW</button>
          ))}
        </div>
      </div>

      {/* EDITOR PANEL */}
      <div className="space-y-16 pb-32">
        <header className="border-b border-current/10 pb-10">
          <h2 className="text-6xl font-black heading-font uppercase tracking-tighter mb-4">Studio Lab</h2>
          <div className="flex gap-4 mt-6 overflow-x-auto pb-2">
             <button onClick={() => setActiveLayer('base')} className={`px-6 py-3 rounded-xl flex-shrink-0 flex items-center gap-2 text-[10px] font-black uppercase transition-all ${activeLayer === 'base' ? 'bg-blue-600 text-white shadow-lg' : 'bg-current/5 opacity-40'}`}><Layers size={14}/> Silhouette</button>
             <button onClick={() => setActiveLayer('image')} className={`px-6 py-3 rounded-xl flex-shrink-0 flex items-center gap-2 text-[10px] font-black uppercase transition-all ${activeLayer === 'image' ? 'bg-blue-600 text-white shadow-lg' : 'bg-current/5 opacity-40'}`}><ImageIcon size={14}/> Graphics</button>
             <button onClick={() => setActiveLayer('text')} className={`px-6 py-3 rounded-xl flex-shrink-0 flex items-center gap-2 text-[10px] font-black uppercase transition-all ${activeLayer === 'text' ? 'bg-blue-600 text-white shadow-lg' : 'bg-current/5 opacity-40'}`}><Type size={14}/> Typography</button>
          </div>
        </header>

        <div className="space-y-12">
          {activeLayer === 'base' && (
            <section className="space-y-8 animate-fade-in">
              <div className="space-y-6">
                <label className="text-[10px] font-black uppercase opacity-40 tracking-widest">Silhouette</label>
                <div className="grid grid-cols-2 gap-6">
                  {['tshirt', 'hoodie'].map(t => (
                    <button key={t} onClick={() => updateStateAndHistory({ garmentType: t as GarmentType })} className={`p-10 rounded-[40px] border-2 transition-all flex flex-col items-center gap-4 ${state.garmentType === t ? 'border-blue-600 bg-blue-600/5' : 'border-current/5 opacity-40'}`}><span className="font-black text-2xl uppercase">{t}</span></button>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <label className="text-[10px] font-black uppercase opacity-40 tracking-widest">Pigment</label>
                <div className="flex flex-wrap gap-4">
                  {COLORS.map(c => (
                    <button key={c.hex} onClick={() => updateStateAndHistory({ color: c })} className={`w-12 h-12 rounded-full border-4 transition-all ${state.color.hex === c.hex ? 'border-blue-600 scale-110' : 'border-current/10 opacity-60'}`} style={{ backgroundColor: c.hex }} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {activeLayer === 'image' && (
            <section className="space-y-8 animate-fade-in">
              <label className="group relative h-40 border-2 border-dashed border-current/10 rounded-[40px] flex flex-col items-center justify-center gap-4 cursor-pointer overflow-hidden">
                 {currentDesign.image ? <img src={currentDesign.image} className="w-full h-full object-cover" /> : <Upload size={32} className="opacity-40" />}
                 <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
              </label>
              {currentDesign.image && (
                <div className="p-8 bg-current/5 rounded-[40px] space-y-6">
                   <div className="flex justify-between items-center"><span className="text-[10px] font-black uppercase opacity-40">Resize Scale</span><span className="text-[10px] font-mono font-black">{Math.round(currentDesign.imageScale * 100)}%</span></div>
                   <input type="range" min="0.1" max="2" step="0.01" value={currentDesign.imageScale} onChange={e => updateCurrentDesign({ imageScale: parseFloat(e.target.value) })} className="w-full h-1.5 bg-current/10 rounded-full appearance-none cursor-pointer accent-blue-600" />
                   <div className="flex justify-between items-center"><span className="text-[10px] font-black uppercase opacity-40">Rotation</span><span className="text-[10px] font-mono font-black">{currentDesign.imageRotation}°</span></div>
                   <input type="range" min="0" max="360" step="1" value={currentDesign.imageRotation} onChange={e => updateCurrentDesign({ imageRotation: parseInt(e.target.value) })} className="w-full h-1.5 bg-current/10 rounded-full appearance-none cursor-pointer accent-blue-600" />
                   <button onClick={() => updateCurrentDesign({ image: null }, true)} className="w-full py-4 rounded-2xl bg-red-500/10 text-red-500 font-black uppercase text-[10px] flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={14}/> Remove Design</button>
                </div>
              )}
            </section>
          )}

          {activeLayer === 'text' && (
            <section className="space-y-8 animate-fade-in">
              <div className="p-8 bg-current/5 border border-current/10 rounded-[40px] space-y-6">
                <input type="text" value={currentDesign.text} onChange={e => updateCurrentDesign({ text: e.target.value })} placeholder="TYPE LABEL HERE" className="w-full bg-transparent border-b border-current/10 py-5 text-xl font-black outline-none focus:border-blue-500 transition-all" />
                <div className="space-y-4">
                   <div className="flex justify-between items-center"><span className="text-[10px] font-black uppercase opacity-40">Text Size</span></div>
                   <input type="range" min="0.5" max="5" step="0.1" value={currentDesign.textScale} onChange={e => updateCurrentDesign({ textScale: parseFloat(e.target.value) })} className="w-full h-1.5 bg-current/10 rounded-full appearance-none cursor-pointer accent-blue-600" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <select value={currentDesign.textFont} onChange={e => updateCurrentDesign({ textFont: e.target.value }, true)} className="bg-current/5 border border-current/10 rounded-2xl p-4 text-[10px] font-black uppercase outline-none">
                     {FONTS.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
                  </select>
                  <div className="flex gap-2 flex-wrap justify-center sm:justify-end">
                     {['#000000', '#FFFFFF', '#3B82F6', '#EF4444', '#10B981'].map(c => (
                       <button key={c} onClick={() => updateCurrentDesign({ textColor: c }, true)} className={`w-10 h-10 rounded-lg border-2 ${currentDesign.textColor === c ? 'border-blue-500 scale-110' : 'border-transparent'}`} style={{ backgroundColor: c }} />
                     ))}
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        <footer className="pt-16 border-t border-current/10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="text-center md:text-left">
            <span className="text-[10px] font-black uppercase opacity-40 tracking-[0.2em]">Final Rate</span>
            <div className="text-5xl font-black font-mono tracking-tighter leading-none mt-2">${state.garmentType === 'tshirt' ? 35 : 65}</div>
          </div>
          <button onClick={() => onAddToCart({ ...state, id: editItem?.id || Math.random().toString(36).substr(2, 6), price: state.garmentType === 'tshirt' ? 35 : 65 })} className="bg-blue-600 text-white px-16 py-8 rounded-[30px] font-black text-xl uppercase tracking-widest shadow-2xl hover:scale-[1.05] active:scale-95 transition-all w-full md:w-auto flex items-center justify-center gap-4">
            {editItem ? 'Update Spec' : 'Add to Stash'} <ShoppingBag size={24} />
          </button>
        </footer>
      </div>
    </div>
  );
};

export default Customizer;
