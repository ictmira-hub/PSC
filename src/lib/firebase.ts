import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  query,
  orderBy,
  increment,
  writeBatch
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { AssetItem } from '../types';
import { INITIAL_ASSETS } from '../data/seedData';

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Use the database ID from config if present
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

const ASSETS_COLLECTION = 'assets';
const LOCAL_STORAGE_KEY = 'packsify_assets_cache';

// Helper to get local cached assets
export function getLocalCachedAssets(): AssetItem[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        // Filter out legacy sample mock assets if present
        const filtered = parsed.filter(
          (a) => !['asset-1', 'asset-2', 'asset-3', 'asset-4', 'asset-5', 'asset-6', 'asset-7', 'asset-8', 'asset-9', 'asset-10', 'asset-11', 'asset-12'].includes(a.id)
        );
        return filtered;
      }
    }
  } catch (e) {
    console.warn('Failed to load assets from localStorage:', e);
  }
  return [];
}

// Helper to save local cached assets
export function saveLocalCachedAssets(assets: AssetItem[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(assets));
  } catch (e) {
    console.warn('Failed to save assets to localStorage:', e);
  }
}

// Seed initial database if empty (No default values per user request)
export async function seedInitialAssetsIfEmpty(): Promise<void> {
  // Left empty so user can add custom verified assets without mock noise
}

// Real-time assets listener
export function subscribeToAssets(
  onData: (assets: AssetItem[]) => void,
  onError?: (err: Error) => void
) {
  try {
    const assetsRef = collection(db, ASSETS_COLLECTION);
    const q = query(assetsRef, orderBy('createdAt', 'desc'));

    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const items: AssetItem[] = [];
          snapshot.forEach((docSnap) => {
            items.push(docSnap.data() as AssetItem);
          });
          saveLocalCachedAssets(items);
          onData(items);
        } else {
          onData([]);
        }
      },
      (error) => {
        console.warn('Firestore snapshot error (falling back to local cache):', error);
        if (onError) onError(error);
        onData(getLocalCachedAssets());
      }
    );
  } catch (e) {
    console.warn('Firebase subscribe failed, using cache:', e);
    onData(getLocalCachedAssets());
    return () => {};
  }
}

// Add new asset
export async function createAssetDoc(asset: AssetItem): Promise<void> {
  try {
    const docRef = doc(db, ASSETS_COLLECTION, asset.id);
    await setDoc(docRef, asset);
  } catch (error) {
    console.warn('Firestore create error, saving locally:', error);
  }
  // Update local cache as well
  const current = getLocalCachedAssets();
  const updated = [asset, ...current.filter((a) => a.id !== asset.id)];
  saveLocalCachedAssets(updated);
}

// Update existing asset
export async function updateAssetDoc(id: string, updates: Partial<AssetItem>): Promise<void> {
  try {
    const docRef = doc(db, ASSETS_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.warn('Firestore update error, saving locally:', error);
  }
  const current = getLocalCachedAssets();
  const updated = current.map((item) =>
    item.id === id ? { ...item, ...updates, updatedAt: Date.now() } : item
  );
  saveLocalCachedAssets(updated);
}

// Delete asset
export async function deleteAssetDoc(id: string): Promise<void> {
  try {
    const docRef = doc(db, ASSETS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.warn('Firestore delete error, deleting locally:', error);
  }
  const current = getLocalCachedAssets();
  const updated = current.filter((item) => item.id !== id);
  saveLocalCachedAssets(updated);
}

// Record copy event
export async function trackCopyClick(id: string, team: 'CS' | 'Growth'): Promise<void> {
  try {
    const docRef = doc(db, ASSETS_COLLECTION, id);
    if (team === 'CS') {
      await updateDoc(docRef, { copyCountCS: increment(1) });
    } else {
      await updateDoc(docRef, { copyCountGrowth: increment(1) });
    }
  } catch (e) {
    console.warn('Track copy error:', e);
  }
  // Local increment
  const current = getLocalCachedAssets();
  const updated = current.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        copyCountCS: team === 'CS' ? (item.copyCountCS || 0) + 1 : item.copyCountCS || 0,
        copyCountGrowth: team === 'Growth' ? (item.copyCountGrowth || 0) + 1 : item.copyCountGrowth || 0,
      };
    }
    return item;
  });
  saveLocalCachedAssets(updated);
}
