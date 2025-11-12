// script.js
import { db } from "./firebase.js";
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.querySelector('.container');
  const searchInput = document.getElementById('searchInput');
  const suggestionList = document.getElementById("wineSuggestion");
  const tagBTns = document.querySelectorAll(".tag-btn");

  // 🔥 Carrega vinhos do Firebase
  async function carregarVinhos() {
    container.innerHTML = "<p style='color:white'>Carregando vinhos...</p>";
    const q = query(collection(db, "produtos"), where("ativo", "==", true));
    const snapshot = await getDocs(q);

    container.innerHTML = "";
    snapshot.forEach(doc => {
      const v = doc.data();
      const card = document.createElement('section');
      card.classList.add('wine-card');
      card.dataset.type = v.tipo?.toLowerCase() || 'tinto';
      card.innerHTML = `
        <img src="${v.imagem}" alt="${v.nome}">
        <h2>${v.nome}<span class="country-flag">${v.paisEmoji || ''}</span></h2>
        <p class="info-tipo">Tipo: ${v.tipo}</p>
        <p class="info-uva">Uva: ${v.uva}</p>
        <p class="info-pais">País: ${v.pais}</p>
        <span class="valor">R$ ${parseFloat(v.preco).toFixed(2)}</span>
      `;
      container.appendChild(card);

      // adicionar opção de busca
      const option = document.createElement('option');
      option.value = v.nome;
      suggestionList.appendChild(option);
    });
  }

  await carregarVinhos();

  // 🔍 Busca simples
  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.trim().toLowerCase();
    const cards = document.querySelectorAll('.wine-card');
    cards.forEach((card) => {
      const text = card.textContent.toLowerCase();
      card.classList.toggle('hidden', !text.includes(term));
    });
  });

  // 🏷️ Filtro por tag (tinto, rosé, etc.)
  tagBTns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const selectedType = btn.dataset.type.toLowerCase();
      tagBTns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const cards = document.querySelectorAll('.wine-card');
      cards.forEach((card) => {
        const type = card.dataset.type;
        card.classList.toggle('hidden', selectedType !== 'all' && type !== selectedType);
      });
    });
  });
});
