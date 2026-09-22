import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type StoredState = {
  selectedIds: string[];
  freedBytes: number;
};

type PhotoLibraryContextValue = {
  selectedIds: string[];
  freedBytes: number;
  toggleSelection: (id: string) => void;
  removeSelected: () => Promise<void>;
};

const STORAGE_KEY = 'clearspace-library-state';
const PhotoLibraryContext = createContext<PhotoLibraryContextValue | null>(null);

export function PhotoLibraryProvider({ children }: { children: React.ReactNode }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [freedBytes, setFreedBytes] = useState(0);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((value) => {
      if (!value) return;
      try {
        const parsed = JSON.parse(value) as StoredState;
        setSelectedIds(parsed.selectedIds ?? []);
        setFreedBytes(parsed.freedBytes ?? 0);
      } catch {
        // Ignore an unreadable local cache and start with a clean review state.
      }
    });
  }, []);

  const persist = (nextIds: string[], nextFreed: number) => {
    return AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ selectedIds: nextIds, freedBytes: nextFreed }),
    );
  };

  const toggleSelection = (id: string) => {
    setSelectedIds((current) => {
      const next = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];
      void persist(next, freedBytes);
      return next;
    });
  };

  const removeSelected = async () => {
    const nextFreed = freedBytes + selectedIds.length * 24500000;
    setSelectedIds([]);
    setFreedBytes(nextFreed);
    await persist([], nextFreed);
  };

  const value = useMemo(
    () => ({ selectedIds, freedBytes, toggleSelection, removeSelected }),
    [selectedIds, freedBytes],
  );

  return <PhotoLibraryContext.Provider value={value}>{children}</PhotoLibraryContext.Provider>;
}

export function usePhotoLibrary() {
  const context = useContext(PhotoLibraryContext);
  if (!context) throw new Error('usePhotoLibrary must be used inside PhotoLibraryProvider');
  return context;
}