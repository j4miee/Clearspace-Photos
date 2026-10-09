import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type StoredState = {
  pendingRemovalIds: string[];
  keptIds: string[];
  freedBytes: number;
  clearedPhotoCount: number;
};

type PhotoLibraryContextValue = StoredState & {
  ready: boolean;
  scannedPhotoCount: number;
  similarGroupCount: number;
  markForRemoval: (id: string) => void;
  keepPhoto: (id: string) => void;
  recordDeleted: (ids: string[], bytes: number) => Promise<void>;
  setScanSummary: (photoCount: number, groupCount: number) => void;
};

const STORAGE_KEY = 'clearspace-library-state-v2';
const EMPTY_STATE: StoredState = {
  pendingRemovalIds: [],
  keptIds: [],
  freedBytes: 0,
  clearedPhotoCount: 0,
};
const PhotoLibraryContext = createContext<PhotoLibraryContextValue | null>(null);

export function PhotoLibraryProvider({ children }: { children: React.ReactNode }) {
  const [stored, setStored] = useState<StoredState>(EMPTY_STATE);
  const [ready, setReady] = useState(false);
  const [scannedPhotoCount, setScannedPhotoCount] = useState(0);
  const [similarGroupCount, setSimilarGroupCount] = useState(0);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (!active || !value) return;
        try {
          const parsed = JSON.parse(value) as Partial<StoredState>;
          setStored({
            pendingRemovalIds: parsed.pendingRemovalIds ?? [],
            keptIds: parsed.keptIds ?? [],
            freedBytes: parsed.freedBytes ?? 0,
            clearedPhotoCount: parsed.clearedPhotoCount ?? 0,
          });
        } catch {
          // Start clean if a prior local state cannot be read.
        }
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const persist = (next: StoredState) => {
    setStored(next);
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => undefined);
  };

  const markForRemoval = (id: string) => {
    const next: StoredState = {
      ...stored,
      pendingRemovalIds: stored.pendingRemovalIds.includes(id)
        ? stored.pendingRemovalIds
        : [...stored.pendingRemovalIds, id],
      keptIds: stored.keptIds.filter((keptId) => keptId !== id),
    };
    persist(next);
  };

  const keepPhoto = (id: string) => {
    const next: StoredState = {
      ...stored,
      pendingRemovalIds: stored.pendingRemovalIds.filter((pendingId) => pendingId !== id),
      keptIds: stored.keptIds.includes(id) ? stored.keptIds : [...stored.keptIds, id],
    };
    persist(next);
  };

  const recordDeleted = async (ids: string[], bytes: number) => {
    const deleted = new Set(ids);
    const next: StoredState = {
      ...stored,
      pendingRemovalIds: stored.pendingRemovalIds.filter((id) => !deleted.has(id)),
      keptIds: stored.keptIds.filter((id) => !deleted.has(id)),
      freedBytes: stored.freedBytes + bytes,
      clearedPhotoCount: stored.clearedPhotoCount + ids.length,
    };
    setStored(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const setScanSummary = (photoCount: number, groupCount: number) => {
    setScannedPhotoCount(photoCount);
    setSimilarGroupCount(groupCount);
  };

  const value = useMemo(
    () => ({
      ...stored,
      ready,
      scannedPhotoCount,
      similarGroupCount,
      markForRemoval,
      keepPhoto,
      recordDeleted,
      setScanSummary,
    }),
    [stored, ready, scannedPhotoCount, similarGroupCount],
  );

  return <PhotoLibraryContext.Provider value={value}>{children}</PhotoLibraryContext.Provider>;
}

export function usePhotoLibrary() {
  const context = useContext(PhotoLibraryContext);
  if (!context) throw new Error('usePhotoLibrary must be used inside PhotoLibraryProvider');
  return context;
}
