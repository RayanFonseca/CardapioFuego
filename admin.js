import { auth, db } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-storage.js";

const storage = getStorage();
const loginArea = document.getElementById("loginArea");
const adminArea = document.getElementById("adminArea");

// Monitorar login
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginArea.style.display = "none";
    adminArea.style.display = "block";
    carregarVinhos();
  } else {
    loginArea.style.display = "block";
    adminArea.style.display = "none";
  }
});

// Login
document.getElementById("loginBtn").onclick = async () => {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  try {
    await signInWithEmailAndPassword(auth, email, senha);
  } catch (err) {
    alert("Erro ao entrar: " + err.message);
  }
};

// Logout
document.getElementById("logoutBtn").onclick = () => signOut(auth);

// Adicionar novo vinho
document.getElementById("addBtn").onclick = async () => {
  const nome = document.getElementById("nome").value;
  const preco = parseFloat(document.getElementById("preco").value);
  const tipo = document.getElementById("tipo").value;
  const uva = document.getElementById("uva").value;
  const pais = document.getElementById("pais").value;
  const paisEmoji = document.getElementById("paisEmoji").value;
  const fotoFile = document.getElementById("fotoInput").files[0];

  if (!nome || !preco || !tipo || !fotoFile) {
    alert("Preencha nome, preço, tipo e selecione uma foto!");
    return;
  }

  // 🔥 1. Enviar foto para o Firebase Storage
  const storageRef = ref(storage, `vinhos/${fotoFile.name}`);
  await uploadBytes(storageRef, fotoFile);
  const imageURL = await getDownloadURL(storageRef);

  // 🔥 2. Adicionar dados no Firestore
  await addDoc(collection(db, "produtos"), {
    nome, preco, tipo, uva, pais, paisEmoji,
    imagem: imageURL,
    ativo: true
  });

  alert("🍷 Vinho adicionado com sucesso!");
  carregarVinhos();
};

// Mostrar lista de vinhos
async function carregarVinhos() {
  const lista = document.getElementById("listaVinhos");
  lista.innerHTML = "<p>Carregando...</p>";

  const snapshot = await getDocs(collection(db, "produtos"));
  lista.innerHTML = "";

  snapshot.forEach(docSnap => {
    const v = docSnap.data();
    lista.innerHTML += `
      <div style="border:1px solid #ccc; padding:10px; margin:10px;">
        <img src="${v.imagem}" width="80"><br>
        <b>${v.nome}</b> - R$ ${v.preco.toFixed(2)} (${v.tipo})<br>
        <button onclick="remover('${docSnap.id}')">🗑️ Remover</button>
      </div>
    `;
  });
}

// Remover vinho
window.remover = async (id) => {
  await deleteDoc(doc(db, "produtos", id));
  carregarVinhos();
};
