# Audiobook File Organization Structure

## Overview
This document outlines the organized file structure for the Eternal Chase trilogy audiobooks, implemented to prevent file misplacement and ensure maintainable organization.

## Directory Structure

```
attached_assets/
└── audiobooks/
    └── english/
        ├── series-intros/           # Trilogy introductions and prologues
        ├── book1-eternal-chase/     # Book 1: The Pursuit for Love
        ├── book2-spiral-galaxy/     # Book 2: Spiral Galaxy War
        ├── book3-ascensions-edge/   # Book 3: Ascension's Edge
        └── young-adult/             # YA prequel content
```

## Benefits of This Structure

1. **No Lost Files**: Every audiobook has a dedicated folder
2. **Easy Navigation**: Logical book/series organization
3. **Scalable**: Can easily add new books or languages
4. **Maintainable**: Clear separation between different content types
5. **Future-Proof**: Ready for Spanish translations or additional series

## File Location Guide

### Series Introductions (`series-intros/`)
- `Now Entering te Final Trilogy Intro_1753633285053.wav`
- `Prologue Before the Chase_1753633285053.wav`

### Book 1: Eternal Chase (`book1-eternal-chase/`)
- `Chapter 1 The Signal Calls.wav`
- (Additional Book 1 chapters when available)

### Book 2: Spiral Galaxy War (`book2-spiral-galaxy/`)
- `Chapter 13 — The Path of Betrayal_1753633664618.wav`
- `Chapter 14 Embers of Destiny_1753634240430.wav`
- `Epilogue Teaser Shadows of the Source_1753634240431.wav`
- `Puzzle Guide and Decode Key for Shadows of the Source Teaser_1753634240431.wav`

### Book 3: Ascension's Edge (`book3-ascensions-edge/`)
- `CHAPTER 1 FRACTURED REFLECTIONS Part One_1754104474669.wav`
- `CHAPTER 1 FRACTURED REFLECTIONS Part two_1754104578517.wav`
- `CHAPTER 2 THE ARCHITECT'S GAMBIT Part One_1753634625850.wav`
- `CHAPTER 2 THE ARCHITECT'S GAMBIT Part Two_1753634625850.wav`
- `CHAPTER 3 HUNTERS IN THE VOID_1753634625850.wav`
- `CHAPTER 4 THE BURDEN OF GODHOOD_1753634625851.wav`
- `CHAPTER 5 VEILS BETWEEN WORLDS_1753634625851.wav`
- `CHAPTER 6 THE PRICE OF REMEMBERING_1753634625852.wav`
- `CHAPTER 7 THE UNMAKING_1753634764160.wav`
- `CHAPTER 8 FRACTURED HEAVENS_1753634764161.wav`
- `CHAPTER 9 THE LAST HORIZON Part One_1753634764161.wav`
- `CHAPTER 9 THE LAST HORIZON Part Two_1753634764162.wav`
- `CHAPTER 10 ASCENSION'S EDGE Part One_1753634764162.wav`
- `CHAPTER 10 ASCENSION'S EDGE Part Two_1753634764163.wav`
- `EPILOGUE BEYOND THE VEIL_1753634764163.wav`

## Code Integration

All file paths in `client/src/lib/audiobook-data.ts` have been updated to use this organized structure:

```typescript
// Example path format:
fileName: '@assets/audiobooks/english/book3-ascensions-edge/CHAPTER_NAME.wav'
```

## Future Expansion

When adding new content:
1. **New Books**: Create `book4-title/`, `book5-title/`, etc.
2. **Spanish Audio**: Create `audiobooks/spanish/` with same subfolder structure
3. **Special Content**: Use descriptive folder names like `bonus-content/` or `behind-scenes/`

## Maintenance Notes

- Never place audiobook files directly in `/audiobooks/english/` root
- Always use the appropriate subfolder based on content type
- When adding new files, update both the file system and `audiobook-data.ts`
- Keep this documentation updated when structure changes

## Status: ✅ COMPLETE
All existing audiobook files have been moved to their proper organized locations and all code references updated accordingly.