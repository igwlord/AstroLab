export {};
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signInAnonymously, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAPnyVOtKxUo9PpI0b76jmHZJYZUXC5-_w",
  authDomain: "astrlab-web.firebaseapp.com",
  projectId: "astrlab-web",
  storageBucket: "astrlab-web.firebasestorage.app",
  messagingSenderId: "773994325277",
  appId: "1:773994325277:web:a2fdb76aad763817812df4",
  measurementId: "G-20PFL50M7L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
  // Asegurar que use popup y no redirect implícito
  display: 'popup'
});

// Configurar scopes específicos
googleProvider.addScope('profile');
googleProvider.addScope('email');

/**
 * Inicia sesión con Google usando popup (con fallback a redirect)
 */
export const signInWithGoogle = async (useRedirect = false): Promise<any> => {
  try {
    console.log('🔵 [Firebase] Iniciando Google Sign-In...', { useRedirect, currentUser: !!auth.currentUser });
    
    let result;
    
    if (useRedirect) {
      // Método redirect (recarga la página)
      console.log('🔄 [Firebase] Usando signInWithRedirect...');
      await signInWithRedirect(auth, googleProvider);
      // El resultado se maneja en handleRedirectResult
      return { success: true, pending: true };
    } else {
      // Método popup (más rápido, pero puede fallar)
      console.log('🔵 [Firebase] Abriendo popup de Google...');
      
      // CRÍTICO: Asegurar que el popup se abre en el contexto del usuario
      // y no hay múltiples llamadas simultáneas
      result = await signInWithPopup(auth, googleProvider);
      
      console.log('✅ [Firebase] Popup cerrado con éxito');
      console.log('✅ [Firebase] Usuario recibido:', result.user.email);
    }
    
    const user = result.user;
    console.log('🔵 [Firebase] Procesando usuario...', { uid: user.uid, email: user.email });
    
    // Crear documento de usuario si no existe
    await ensureUserDocument(user.uid, {
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      lastLogin: new Date().toISOString(),
      loginMethod: 'google'
    });
    
    console.log('✅ Google Sign-In successful:', user.email);
    return { success: true, user };
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    
    // Mensajes de error amigables
    let errorMessage = 'Error al iniciar sesión';
    
    if (err.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Ventana cerrada. Por favor intenta de nuevo.';
    } else if (err.code === 'auth/popup-blocked') {
      // Si el popup fue bloqueado, intentar con redirect
      console.log('🔄 Popup bloqueado, usando redirect...');
      return signInWithGoogle(true);
    } else if (err.code === 'auth/cancelled-popup-request') {
      errorMessage = 'Operación cancelada. Por favor intenta de nuevo.';
    } else if (err.code === 'auth/network-request-failed') {
      errorMessage = 'Error de conexión. Verifica tu internet.';
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    console.warn('Google Sign-In cancelled or failed:', err.code || err.message);
    return { success: false, error: errorMessage };
  }
};

/**
 * Maneja el resultado del redirect de Google (si se usó signInWithRedirect)
 */
export const handleRedirectResult = async () => {
  try {
    console.log('🔵 [Firebase] Verificando redirect result...');
    console.log('🔵 [Firebase] URL actual:', window.location.href);
    console.log('🔵 [Firebase] Auth currentUser antes de getRedirectResult:', auth.currentUser?.email || 'ninguno');
    
    const result = await getRedirectResult(auth);
    
    console.log('🔵 [Firebase] getRedirectResult response:', result);
    console.log('🔵 [Firebase] result es null?', result === null);
    console.log('🔵 [Firebase] Auth currentUser después de getRedirectResult:', auth.currentUser?.email || 'ninguno');
    
    // Si getRedirectResult devuelve null pero hay currentUser, significa que el redirect ya se procesó
    if (!result && auth.currentUser) {
      console.log('✅ [Firebase] Usuario ya autenticado (redirect ya procesado):', auth.currentUser.email);
      return { success: true, user: auth.currentUser, alreadyProcessed: true };
    }
    
    if (result && result.user) {
      console.log('✅ [Firebase] Redirect result tiene usuario:', result.user.email);
      
      // Crear documento de usuario si no existe
      console.log('🔵 [Firebase] Creando/actualizando documento de usuario...');
      await ensureUserDocument(result.user.uid, {
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        lastLogin: new Date().toISOString(),
        loginMethod: 'google'
      });
      
      console.log('✅ [Firebase] Google Sign-In (redirect) successful:', result.user.email);
      return { success: true, user: result.user };
    }
    
    console.log('🔵 [Firebase] No hay redirect result (login normal o ya procesado)');
    return { success: false, error: null };
  } catch (error: unknown) {
    const err = error as { message?: string; code?: string };
    console.error('❌ [Firebase] Error handling redirect result:', err);
    return { success: false, error: err.message || 'Error al procesar login' };
  }
};

/**
 * Inicia sesión en modo de prueba (anónimo)
 */
export const signInAnonymousMode = async () => {
  try {
    const result = await signInAnonymously(auth);
    const user = result.user;
    
    // Crear documento de usuario anónimo
    await ensureUserDocument(user.uid, {
      email: null,
      displayName: 'Usuario de Prueba',
      photoURL: null,
      lastLogin: new Date().toISOString(),
      loginMethod: 'anonymous'
    });
    
    return { success: true, user };
  } catch (error: any) {
    console.error('Error signing in anonymously:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Cierra sesión
 */
export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    console.error('Error signing out:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Escucha cambios en el estado de autenticación
 */
export const onAuthChange = (callback: (user: any) => void) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Asegura que existe el documento del usuario en Firestore
 */
const ensureUserDocument = async (uid: string, userData: any) => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    // Crear nuevo documento
    await setDoc(userRef, {
      ...userData,
      createdAt: new Date().toISOString(),
      settings: {
        theme: 'system',
        language: 'es'
      },
      savedCharts: []
    });
  } else {
    // Actualizar último login
    await setDoc(userRef, {
      lastLogin: new Date().toISOString()
    }, { merge: true });
  }
};

/**
 * Guarda la configuración del usuario en la nube
 */
export const saveUserSettings = async (uid: string, settings: any) => {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      settings,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return { success: true };
  } catch (error: any) {
    console.error('Error saving settings:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Obtiene la configuración del usuario desde la nube
 */
export const getUserSettings = async (uid: string) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { success: true, settings: userSnap.data().settings };
    }
    return { success: false, error: 'User not found' };
  } catch (error: any) {
    console.error('Error getting settings:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Guarda una carta natal en la nube
 */
export const saveNatalChart = async (uid: string, chartData: any) => {
  try {
    const chartsRef = collection(db, 'users', uid, 'charts');
    const chartDoc = doc(chartsRef);
    
    await setDoc(chartDoc, {
      ...chartData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return { success: true, chartId: chartDoc.id };
  } catch (error: any) {
    console.error('Error saving chart:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Obtiene todas las cartas guardadas del usuario
 */
export const getSavedCharts = async (uid: string) => {
  try {
    const chartsRef = collection(db, 'users', uid, 'charts');
    const querySnapshot = await getDocs(chartsRef);
    
    const charts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return { success: true, charts };
  } catch (error: any) {
    console.error('Error getting charts:', error);
    return { success: false, error: error.message, charts: [] };
  }
};

/**
 * Obtiene información del usuario actual
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Verifica si el usuario está autenticado
 */
export const isAuthenticated = () => {
  return auth.currentUser !== null;
};
