export interface Sticker {
  id: string;
  imageUrl: string;
  prompt: string;
  theme: StickerTheme;
  createdAt: number;
}

export enum StickerTheme {
  Anime = 'Anime',
  Cartoon = 'Cartoon',
  Marvel = 'Marvel',
  DC = 'DC Comics',
  PixelArt = 'Pixel Art',
  Watercolor = 'Watercolor',
  Graffiti = 'Graffiti',
  Kawaii = 'Kawaii',
  Cyberpunk = 'Cyberpunk',
  Retro3D = 'Retro 3D'
}

export interface GenerationStatus {
  isGenerating: boolean;
  error: string | null;
}