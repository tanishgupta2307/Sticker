import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Image as ImageIcon, Search, Zap, LayoutGrid, List, Square, RectangleVertical, RectangleHorizontal, Smartphone, Monitor, Circle, Egg, Hexagon, Octagon } from 'lucide-react';
import { Sticker, StickerTheme, GenerationStatus } from './types';
import { generateStickerImage } from './services/geminiService';
import { PLACEHOLDER_PROMPTS } from './constants';
import ThemeSelector from './components/ThemeSelector';
import StickerCard from './components/StickerCard';
import Button from './components/Button';
import { Toaster, toast } from 'react-hot-toast';

function App() {
  const [prompt, setPrompt] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<StickerTheme>(StickerTheme.Anime);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [status, setStatus] = useState<GenerationStatus>({ isGenerating: false, error: null });
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  
  // Layout State
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');
  const [cardShape, setCardShape] = useState<'square' | 'portrait' | 'landscape' | 'wide' | 'tall' | 'circle' | 'oval' | 'hexagon' | 'octagon'>('square');
  
  // Reference to scroll to result
  const resultRef = useRef<HTMLDivElement>(null);

  // Rotate placeholders
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDER_PROMPTS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleGenerate = async (promptText: string = prompt, theme: StickerTheme = selectedTheme) => {
    if (!promptText.trim()) {
      toast.error("Tell me what to draw! 🎨");
      return;
    }

    setStatus({ isGenerating: true, error: null });
    
    // Playful loading messages
    const loadingToast = toast.loading("Waking up the artists...", { icon: '🧑‍🎨' });
    const messages = ["Mixing colors...", "Sharpening pencils...", "Adding magic dust...", "Almost there..."];
    let msgIdx = 0;
    const msgInterval = setInterval(() => {
        toast.loading(messages[msgIdx % messages.length], { id: loadingToast });
        msgIdx++;
    }, 1500);

    try {
      const imageUrl = await generateStickerImage(promptText, theme);
      clearInterval(msgInterval);
      
      const newSticker: Sticker = {
        id: crypto.randomUUID(),
        imageUrl,
        prompt: promptText,
        theme: theme,
        createdAt: Date.now(),
      };

      setStickers((prev) => [newSticker, ...prev]);
      setPrompt(''); 
      toast.success("Sticker ready!", { id: loadingToast, icon: '✨' });
      
      // Smooth scroll to the result after a brief delay for rendering
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

    } catch (error: any) {
      clearInterval(msgInterval);
      console.error(error);
      setStatus({ isGenerating: false, error: error.message || "Oops, something went wrong" });
      toast.error("Artists are on break. Try again!", { id: loadingToast });
    } finally {
      setStatus({ isGenerating: false, error: null });
    }
  };

  const handleRegenerate = (sticker: Sticker) => {
    setPrompt(sticker.prompt);
    setSelectedTheme(sticker.theme);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast("Settings restored! Hit Generate to remix.", { icon: '🎛️' });
  };

  const handleDelete = (id: string) => {
    setStickers((prev) => prev.filter(s => s.id !== id));
    toast.success("Poof! It's gone.");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative overflow-x-hidden pb-32">
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            borderRadius: '1.5rem',
            background: '#333',
            color: '#fff',
            fontWeight: 600,
          },
        }}
      />

      {/* Decorative Background Blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <main className="relative z-10 max-w-md mx-auto px-4 pt-8 md:pt-12 flex flex-col gap-8">
        
        {/* Playful Header */}
        <header className="flex flex-col items-center text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/50 shadow-sm mb-2">
            <Sparkles size={16} className="text-amber-500" fill="currentColor" />
            <span className="text-xs font-bold text-slate-600 tracking-wide uppercase">AI Sticker Factory</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tight leading-tight">
            Dream it. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Stick it.
            </span>
          </h1>
        </header>

        {/* Input Section (Card) */}
        <div className="bg-white/70 backdrop-blur-lg p-5 rounded-[2.5rem] shadow-xl shadow-indigo-100 border border-white space-y-6">
          
          {/* Text Area */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-3xl opacity-20 group-focus-within:opacity-100 transition duration-500 blur"></div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`e.g., "${PLACEHOLDER_PROMPTS[placeholderIndex]}"`}
              className="relative w-full p-6 bg-white border-none rounded-3xl text-lg font-medium text-slate-700 placeholder:text-slate-400 focus:ring-0 resize-none h-32 shadow-inner"
              style={{ fontSize: '1.1rem' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
            />
            <div className="absolute bottom-4 right-4 text-slate-300 pointer-events-none">
              <Zap size={20} fill="currentColor" />
            </div>
          </div>

          {/* Theme Selector */}
          <ThemeSelector selectedTheme={selectedTheme} onSelectTheme={setSelectedTheme} />

          {/* Generate Button */}
          <Button 
            onClick={() => handleGenerate()} 
            isLoading={status.isGenerating}
            className="w-full text-xl py-5 shadow-xl shadow-indigo-300/50"
            variant="primary"
          >
            {status.isGenerating ? 'Cooking...' : 'Make Sticker'}
          </Button>
        </div>

        {/* View Controls - Now Visible whenever there are stickers */}
        {stickers.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center justify-between bg-white/80 backdrop-blur-md p-2 rounded-2xl border border-white/50 shadow-sm mx-2 overflow-x-auto no-scrollbar">
                
                {/* Layout Toggles */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold text-slate-400 px-2 uppercase tracking-wide hidden sm:block">View</span>
                  <div className="flex bg-slate-100/80 rounded-xl p-1 gap-1">
                    <button
                      onClick={() => setLayoutMode('list')}
                      title="List View"
                      className={`p-2 rounded-lg transition-all ${layoutMode === 'list' ? 'bg-white text-indigo-600 shadow-sm scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      <List size={18} />
                    </button>
                    <button
                      onClick={() => setLayoutMode('grid')}
                      title="Grid View"
                      className={`p-2 rounded-lg transition-all ${layoutMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      <LayoutGrid size={18} />
                    </button>
                  </div>
                </div>

                <div className="w-px h-6 bg-slate-200 mx-2 shrink-0"></div>

                {/* Shape Toggles */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold text-slate-400 px-2 uppercase tracking-wide hidden sm:block">Shape</span>
                  <div className="flex bg-slate-100/80 rounded-xl p-1 gap-1 overflow-x-auto no-scrollbar max-w-[200px] sm:max-w-none">
                      <button 
                      onClick={() => setCardShape('square')}
                      title="Square (1:1)" 
                      className={`p-2 rounded-lg transition-all shrink-0 ${cardShape === 'square' ? 'bg-white text-indigo-600 shadow-sm scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        <Square size={18} />
                      </button>
                      <button 
                      onClick={() => setCardShape('portrait')} 
                      title="Portrait (3:4)"
                      className={`p-2 rounded-lg transition-all shrink-0 ${cardShape === 'portrait' ? 'bg-white text-indigo-600 shadow-sm scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        <RectangleVertical size={18} />
                      </button>
                      <button 
                      onClick={() => setCardShape('landscape')} 
                      title="Landscape (4:3)"
                      className={`p-2 rounded-lg transition-all shrink-0 ${cardShape === 'landscape' ? 'bg-white text-indigo-600 shadow-sm scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        <RectangleHorizontal size={18} />
                      </button>
                      
                      {/* New Shapes */}
                      <button 
                      onClick={() => setCardShape('circle')} 
                      title="Circle"
                      className={`p-2 rounded-lg transition-all shrink-0 ${cardShape === 'circle' ? 'bg-white text-indigo-600 shadow-sm scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        <Circle size={18} />
                      </button>
                      
                       <button 
                      onClick={() => setCardShape('oval')} 
                      title="Oval"
                      className={`p-2 rounded-lg transition-all shrink-0 ${cardShape === 'oval' ? 'bg-white text-indigo-600 shadow-sm scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        <Egg size={18} />
                      </button>
                      
                      <button 
                      onClick={() => setCardShape('hexagon')} 
                      title="Hexagon"
                      className={`p-2 rounded-lg transition-all shrink-0 ${cardShape === 'hexagon' ? 'bg-white text-indigo-600 shadow-sm scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        <Hexagon size={18} />
                      </button>
                      
                      <button 
                      onClick={() => setCardShape('octagon')} 
                      title="Octagon"
                      className={`p-2 rounded-lg transition-all shrink-0 ${cardShape === 'octagon' ? 'bg-white text-indigo-600 shadow-sm scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        <Octagon size={18} />
                      </button>

                      <button 
                      onClick={() => setCardShape('wide')} 
                      title="Wide (16:9)"
                      className={`p-2 rounded-lg transition-all shrink-0 ${cardShape === 'wide' ? 'bg-white text-indigo-600 shadow-sm scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        <Monitor size={18} />
                      </button>
                      <button 
                      onClick={() => setCardShape('tall')} 
                      title="Tall (9:16)"
                      className={`p-2 rounded-lg transition-all shrink-0 ${cardShape === 'tall' ? 'bg-white text-indigo-600 shadow-sm scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        <Smartphone size={18} />
                      </button>
                  </div>
                </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        <div ref={resultRef} className="space-y-6 pt-2">
          
          {/* Latest Creation */}
          {stickers.length > 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="flex items-center gap-2 px-2 mb-3">
                 <div className="h-1 w-6 bg-indigo-500 rounded-full"></div>
                 <h3 className="text-lg font-bold text-slate-800">Fresh from the oven</h3>
              </div>
              <StickerCard 
                sticker={stickers[0]} 
                onRegenerate={handleRegenerate} 
                onDelete={handleDelete}
                featured={true}
                aspectRatio={cardShape} // Now respects shape setting
              />
            </div>
          )}

          {/* Previous Gallery */}
          {stickers.length > 1 && (
            <div className="space-y-4 pt-4">
               <div className="flex items-center justify-between px-2">
                  <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                    <ImageIcon size={20} className="text-slate-400" />
                    Your Stash
                  </h3>
                  <span className="text-xs font-bold bg-white text-slate-500 px-3 py-1 rounded-full shadow-sm">
                    {stickers.length - 1} saved
                  </span>
               </div>
              
              <div className={`grid gap-4 transition-all duration-500 ease-in-out ${layoutMode === 'grid' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {stickers.slice(1).map((sticker) => (
                  <StickerCard 
                    key={sticker.id} 
                    sticker={sticker} 
                    onRegenerate={handleRegenerate}
                    onDelete={handleDelete}
                    aspectRatio={cardShape}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {stickers.length === 0 && !status.isGenerating && (
            <div className="text-center py-12 px-6 opacity-60">
              <div className="inline-block p-4 rounded-full bg-white mb-4 shadow-sm">
                <Search size={32} className="text-indigo-300" />
              </div>
              <p className="text-slate-500 font-medium">Your collection is empty.</p>
              <p className="text-sm text-slate-400">Type something fun above to start!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;