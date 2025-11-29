import { StickerTheme } from './types';
import { Palette, Zap, Ghost, Brush, Gamepad2, Smile, SprayCan, Box } from 'lucide-react';
import React from 'react';

export const THEME_CONFIG: Record<StickerTheme, { icon: React.FC<any>, color: string, description: string }> = {
  [StickerTheme.Anime]: { icon: Zap, color: 'bg-yellow-100 text-yellow-700', description: 'Japanese animation style' },
  [StickerTheme.Cartoon]: { icon: Smile, color: 'bg-blue-100 text-blue-700', description: 'Classic western cartoon' },
  [StickerTheme.Marvel]: { icon: Palette, color: 'bg-red-100 text-red-700', description: 'Dynamic superhero comic style' },
  [StickerTheme.DC]: { icon: Ghost, color: 'bg-slate-800 text-slate-100', description: 'Dark, gritty comic book style' },
  [StickerTheme.PixelArt]: { icon: Gamepad2, color: 'bg-purple-100 text-purple-700', description: '8-bit retro gaming' },
  [StickerTheme.Watercolor]: { icon: Brush, color: 'bg-green-100 text-green-700', description: 'Soft artistic strokes' },
  [StickerTheme.Graffiti]: { icon: SprayCan, color: 'bg-orange-100 text-orange-700', description: 'Urban street art' },
  [StickerTheme.Kawaii]: { icon: Smile, color: 'bg-pink-100 text-pink-700', description: 'Super cute and bubbly' },
  [StickerTheme.Cyberpunk]: { icon: Zap, color: 'bg-cyan-100 text-cyan-700', description: 'Neon futuristic sci-fi' },
  [StickerTheme.Retro3D]: { icon: Box, color: 'bg-indigo-100 text-indigo-700', description: '90s CGI aesthetic' },
};

export const PLACEHOLDER_PROMPTS = [
  "A surfing corgi",
  "Cyberpunk coffee cup",
  "Baby dragon eating pizza",
  "Astronaut sloth",
  "Robot playing guitar"
];