// Firebase Configuration and Service Integration for Tech Island
// 100% Free Spark Plan Compatible (No Blaze Plan or Credit Card Required)
// Uses Firebase Auth + Cloud Firestore. Images are optimized and stored directly in Firestore.

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ============================================================================
// 1. FIREBASE CONFIGURATION KEYS
// Paste the values from your Firebase Project Console -> Project Settings -> General -> Web App
// ============================================================================
export const firebaseConfig = {
  apiKey: "AIzaSyAYloLXpq4ItTzPxKSmn10trluLYTdfUrE",
  authDomain: "techisland-ee502.firebaseapp.com",
  projectId: "techisland-ee502",
  storageBucket: "techisland-ee502.firebasestorage.app",
  messagingSenderId: "1007709276199",
  appId: "1:1007709276199:web:0cde6d77199f63dadd6602"
};

/**
 * Checks whether the user has replaced placeholder credentials with real Firebase keys.
 */
export function isFirebaseConfigured() {
  return (
    firebaseConfig.apiKey &&
    !firebaseConfig.apiKey.includes("PASTE_YOUR_") &&
    firebaseConfig.projectId &&
    !firebaseConfig.projectId.includes("PASTE_YOUR_")
  );
}

// Initialize Firebase only if valid config or first app
let app = null;
let auth = null;
let db = null;

if (isFirebaseConfigured()) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error("Error initializing Firebase:", error);
  }
}

export { app, auth, db };

// ============================================================================
// 2. CLIENT-SIDE IMAGE OPTIMIZER
// Automatically scales and compresses uploaded images into crisp, lightweight
// WebP data URLs (~15 KB - 40 KB) so you don't need paid Cloud Storage!
// ============================================================================
export async function compressImageToDataUrl(file, maxWidth = 800, maxHeight = 800, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio within bounding box
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP format
        let dataUrl = canvas.toDataURL("image/webp", quality);
        if (!dataUrl.startsWith("data:image/webp")) {
          dataUrl = canvas.toDataURL("image/jpeg", quality);
        }
        resolve(dataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// ============================================================================
// 3. AUTHENTICATION HELPERS
// ============================================================================

export async function loginAdmin(email, password) {
  if (!isFirebaseConfigured() || !auth) {
    throw new Error("Firebase is not configured yet. Please update js/firebase-config.js.");
  }
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function logoutAdmin() {
  if (!auth) return;
  return await signOut(auth);
}

export function onAdminAuthChange(callback) {
  if (!isFirebaseConfigured() || !auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

// ============================================================================
// 4. FIRESTORE DATABASE HELPERS (PRODUCTS)
// ============================================================================

const COLLECTION_NAME = "products";

export async function getProductsFromDb() {
  if (!isFirebaseConfigured() || !db) {
    return null;
  }
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
    }));
  } catch (error) {
    console.warn("Fallback to unordered products fetch:", error);
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
    }));
  }
}

export async function addProductToDb({ name, category, description, imageUrl, isSublime = false }) {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firestore is not configured.");
  }
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    name: name.trim(),
    searchName: name.trim().toLowerCase(),
    category: category.trim(),
    description: description.trim(),
    imageUrl: imageUrl ? imageUrl.trim() : "",
    isSublime: Boolean(isSublime),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
}

export async function updateProductInDb(id, updates) {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firestore is not configured.");
  }
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
}

export async function deleteProductFromDb(id) {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firestore is not configured.");
  }
  await deleteDoc(doc(db, COLLECTION_NAME, id));
}

export async function seedInitialProducts(productsArray, progressCallback) {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firestore is not configured.");
  }
  let count = 0;
  for (const item of productsArray) {
    await addDoc(collection(db, COLLECTION_NAME), {
      name: item.name,
      searchName: item.searchName || item.name.toLowerCase(),
      category: item.category,
      description: item.description,
      imageUrl: item.image, // points to local assets/products/...
      isSublime: Boolean(item.isSublime),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    count++;
    if (progressCallback) {
      progressCallback(count, productsArray.length);
    }
  }
  return count;
}
