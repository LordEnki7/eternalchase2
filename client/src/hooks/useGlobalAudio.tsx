import { createContext, useContext, useState, ReactNode } from 'react';

interface GlobalAudioContextType {
  isAudiobookPlaying: boolean;
  setAudiobookPlaying: (playing: boolean) => void;
  pauseThemeMusic: () => void;
  resumeThemeMusic: () => void;
  themeMusicPaused: boolean;
}

const GlobalAudioContext = createContext<GlobalAudioContextType | undefined>(undefined);

export function GlobalAudioProvider({ children }: { children: ReactNode }) {
  const [isAudiobookPlaying, setIsAudiobookPlaying] = useState(false);
  const [themeMusicPaused, setThemeMusicPaused] = useState(false);

  const setAudiobookPlaying = (playing: boolean) => {
    setIsAudiobookPlaying(playing);
    if (playing) {
      setThemeMusicPaused(true);
    } else {
      setThemeMusicPaused(false);
    }
  };

  const pauseThemeMusic = () => {
    setThemeMusicPaused(true);
  };

  const resumeThemeMusic = () => {
    setThemeMusicPaused(false);
  };

  return (
    <GlobalAudioContext.Provider value={{
      isAudiobookPlaying,
      setAudiobookPlaying,
      pauseThemeMusic,
      resumeThemeMusic,
      themeMusicPaused
    }}>
      {children}
    </GlobalAudioContext.Provider>
  );
}

export function useGlobalAudio() {
  const context = useContext(GlobalAudioContext);
  if (context === undefined) {
    throw new Error('useGlobalAudio must be used within a GlobalAudioProvider');
  }
  return context;
}