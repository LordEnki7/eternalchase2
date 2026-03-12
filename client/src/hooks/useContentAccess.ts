import { useAuth } from "./useAuth";
import { useSubscription } from "./useSubscription";

export interface ContentAccess {
  canAccessChapter: (bookId: string, chapterNumber: number) => boolean;
  canAccessFullAudiobook: (bookId: string) => boolean;
  canAccessCharacterGallery: () => boolean;
  canAccessStarMap: () => boolean;
  canAccessYoungAdult: () => boolean;
  getFreeChapterLimit: (bookId: string) => number;
  getAccessMessage: (bookId: string, chapterNumber: number) => string;
}

export function useContentAccess(): ContentAccess {
  const { isAuthenticated } = useAuth();
  const { hasPremiumAccess } = useSubscription();

  // Free content configuration
  const freeChapterLimits = {
    'book-1': 3, // First 3 chapters of "The Pursuit of Love" are free
    'book-2': 0, // No free chapters for Book 2
    'book-3': 0, // No free chapters for Book 3
    'young-adult': 2, // First 2 chapters of Young Adult content are free
  };

  const canAccessChapter = (bookId: string, chapterNumber: number): boolean => {
    // Premium users can access everything
    if (hasPremiumAccess) return true;
    
    // Check free chapter limits
    const freeLimit = freeChapterLimits[bookId as keyof typeof freeChapterLimits] || 0;
    return chapterNumber <= freeLimit;
  };

  const canAccessFullAudiobook = (bookId: string): boolean => {
    return hasPremiumAccess;
  };

  const canAccessCharacterGallery = (): boolean => {
    return true; // Character galleries are free for everyone
  };

  const canAccessStarMap = (): boolean => {
    return true; // Interactive Star Map is free for everyone
  };

  const canAccessYoungAdult = (): boolean => {
    return true; // Young Adult section browsing is free, but content has limits
  };

  const getFreeChapterLimit = (bookId: string): number => {
    return freeChapterLimits[bookId as keyof typeof freeChapterLimits] || 0;
  };

  const getAccessMessage = (bookId: string, chapterNumber: number): string => {
    const freeLimit = getFreeChapterLimit(bookId);
    
    if (chapterNumber <= freeLimit) {
      return "Free Content";
    }
    
    if (hasPremiumAccess) {
      return "Premium Content";
    }
    
    return `Upgrade to Premium to access Chapter ${chapterNumber} and beyond`;
  };

  return {
    canAccessChapter,
    canAccessFullAudiobook,
    canAccessCharacterGallery,
    canAccessStarMap,
    canAccessYoungAdult,
    getFreeChapterLimit,
    getAccessMessage,
  };
}