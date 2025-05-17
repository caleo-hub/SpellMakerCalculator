// assets/js/authentication.js
// ---------------------------

// 1. Imports do SDK (v11.7.3)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc
} from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js';

// 2. Variáveis internas para Auth e DB
let auth;
let db;
const googleProvider = new GoogleAuthProvider();

/**
 * Inicializa Firebase Auth e Firestore.
 * Deve ser chamado uma vez no início da sua aplicação.
 * @param {Object} config — seu firebaseConfig do console
 */
export function initFirebase(config) {
  const app = initializeApp(config);
  auth = getAuth(app);
  db   = getFirestore(app);
}

/**
 * Dispara o fluxo de login com popup do Google.
 * @returns {Promise<User>} — o usuário autenticado
 */
export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

/** Desloga o usuário atual */
export async function logout() {
  await signOut(auth);
}

/**
 * Registra um callback para mudanças de estado de autenticação.
 * @param {(user: User|null) => void} callback
 */
export function onAuthStateChangedListener(callback) {
  onAuthStateChanged(auth, callback);
}

/** Retorna o UID do usuário logado (ou undefined) */
export function getUserUID() {
  return auth.currentUser?.uid;
}

// === FUNÇÕES CRUD PARA CHARACTERS ===

function charsCol(uid) {
  return collection(db, 'users', uid, 'characters');
}

/**
 * Cria ou atualiza um character.
 * Se charId for fornecido, atualiza; senão, cria novo.
 * @returns {Promise<string>} — o ID do document
 */
export async function saveCharacter(uid, data, charId = null) {
  const ref = charId
    ? doc(db, 'users', uid, 'characters', charId)
    : doc(charsCol(uid));
  await setDoc(ref, data);
  return ref.id;
}

/** Carrega todos os characters do usuário */
export async function loadCharacters(uid) {
  const snap = await getDocs(charsCol(uid));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/** Remove um character pelo ID */
export async function deleteCharacter(uid, charId) {
  await deleteDoc(doc(db, 'users', uid, 'characters', charId));
}

// === FUNÇÕES CRUD PARA SPELLS ===

function spellsCol(uid) {
  return collection(db, 'users', uid, 'spells');
}

/**
 * Cria ou atualiza uma spell.
 * data deve incluir { name, school, effect, magnitude, area, duration, … }
 */
export async function saveSpell(uid, data, spellId = null) {
  const ref = spellId
    ? doc(db, 'users', uid, 'spells', spellId)
    : doc(spellsCol(uid));
  await setDoc(ref, data);
  return ref.id;
}

/** Carrega todas as spells do usuário */
export async function loadSpells(uid) {
  const snap = await getDocs(spellsCol(uid));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/** Remove uma spell pelo ID */
export async function deleteSpell(uid, spellId) {
  await deleteDoc(doc(db, 'users', uid, 'spells', spellId));
}
