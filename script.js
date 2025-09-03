// Função para remover acentos
function removerAcentos(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

// =====================
// Ordenação
// =====================
function sortWines() {
  const container = document.querySelector(".container");
  const cards = Array.from(container.querySelectorAll(".wine-card"));

  cards.sort((a, b) => {
    const typeA = a.dataset.type.toLowerCase();
    const typeB = b.dataset.type.toLowerCase();
    if (typeA !== typeB) return typeA.localeCompare(typeB);

    const countryA = a.dataset.pais.toLowerCase();
    const countryB = b.dataset.pais.toLowerCase();
    if (countryA !== countryB) return countryA.localeCompare(countryB);

    const nameA = a.querySelector("h2").textContent.toLowerCase();
    const nameB = b.querySelector("h2").textContent.toLowerCase();
    return nameA.localeCompare(nameB);
  });

  cards.forEach(card => container.appendChild(card));
}

document.addEventListener('DOMContentLoaded', () => {
  // rode a ordenação ANTES de capturar os cards
  sortWines();

  // --------------------------
  // Seletores principais
  // --------------------------
  const searchInput = document.getElementById('searchInput');
  const wineCards = document.querySelectorAll('.wine-card');
  const suggestionList = document.getElementById('wineSuggestion');
  const tagBtns = document.querySelectorAll('.tag-btn'); // Botões de tipo
  const countryBtns = document.querySelectorAll('.country-btn'); // Botões de país
  const backToTop = document.getElementById('backToTop');

  // Popup
  const winePopup = document.getElementById('winePopup');
  const closePopup = document.querySelector('.close-popup');
  const popupTitle = document.getElementById('popupTitle');
  const popupHarmonizacao = document.getElementById('popupHarmonizacao');
  const popupComentario = document.getElementById('popupComentario');

  // Mini-barras
  const barLevezaContainer = document.querySelector('.intensity-item:nth-child(1) .intensity-bar-container');
  const barSuavidadeContainer = document.querySelector('.intensity-item:nth-child(2) .intensity-bar-container');
  const barSecoContainer = document.querySelector('.intensity-item:nth-child(3) .intensity-bar-container');
  const barMaciezContainer = document.querySelector('.intensity-item:nth-child(4) .intensity-bar-container');

  // =====================
  // AUTOCOMPLETE PESQUISA
  // =====================
  wineCards.forEach((card) => {
    const title = card.querySelector('h2')?.textContent || '';
    if (title) {
      const option = document.createElement('option');
      option.value = title;
      suggestionList.appendChild(option);
    }
  });

  // =====================
  // VARIÁVEIS PARA FILTROS E BUSCA
  // =====================
  let currentType = 'all';
  let currentCountry = 'all';
  let currentSearch = '';
  let filteredCards = Array.from(wineCards);
  let winesLoaded = 0;
  const winesPerLoad = 10;

  // Atualiza lista filtrada
  function updateFilteredCards() {
    filteredCards = Array.from(wineCards).filter(card => {
      const title = removerAcentos(card.querySelector('h2')?.textContent || '');
      const type = removerAcentos(card.dataset.type || '');
      const pais = removerAcentos(card.dataset.pais || '');

      const matchesSearch = currentSearch ? title.includes(currentSearch) : true;
      const matchesType = currentType === 'all' || type === currentType;
      const matchesCountry = currentCountry === 'all' || pais === currentCountry;

      return matchesSearch && matchesType && matchesCountry;
    });
  }

  // Carregar mais vinhos
  function loadMoreWines() {
    const nextWines = filteredCards.slice(winesLoaded, winesLoaded + winesPerLoad);
    nextWines.forEach(card => {
      card.style.display = 'block';
      card.classList.remove('hidden');
    });
    winesLoaded += nextWines.length;

    if (winesLoaded >= filteredCards.length) {
      if (observer) observer.unobserve(sentinel);
    }
  }

  // Aplicar filtros e resetar carregamento
  function applyFilters() {
    wineCards.forEach(card => {
      card.style.display = 'none';
      card.classList.add('hidden');
    });
    winesLoaded = 0;
    updateFilteredCards();
    loadMoreWines();

    if (winesLoaded < filteredCards.length) {
      observer.observe(sentinel);
    }
  }

  // =====================
  // EVENTO DE BUSCA
  // =====================
  searchInput.addEventListener('input', (e) => {
    currentSearch = removerAcentos(e.target.value.trim());
    applyFilters();
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchInput.value = '';
      currentSearch = '';
      applyFilters();
      searchInput.blur();
    }
  });

  // =====================
  // FILTRO POR TIPOS
  // =====================
  tagBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      currentType = removerAcentos(btn.dataset.filter.toLowerCase());
      tagBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilters();
    });
  });

  // =====================
  // FILTRO POR PAÍSES
  // =====================
  countryBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      currentCountry = removerAcentos(btn.dataset.country.toLowerCase());
      countryBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilters();
    });
  });

  // =====================
  // BOTÃO VOLTAR AO TOPO
  // =====================
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });

  // =====================
  // POPUP DOS VINHOS
  // =====================
  wineCards.forEach((card) => {
    card.addEventListener('click', () => {
      if (popupTitle) popupTitle.textContent = card.querySelector('h2').textContent;
      if (popupHarmonizacao) popupHarmonizacao.textContent = card.dataset.harmonizacao || 'Não informado';

      updateMiniBars(barLevezaContainer, card.dataset.leveza || 0);
      updateMiniBars(barSuavidadeContainer, card.dataset.suavidade || 0);
      updateMiniBars(barSecoContainer, card.dataset.seco || 0);
      updateMiniBars(barMaciezContainer, card.dataset.maciez || 0);

      const comentario = card.dataset.comentario || 'Um toque especial para elevar sua experiência.';
      if (popupComentario) {
        popupComentario.textContent = comentario;
      }

      if (winePopup) winePopup.classList.add('show');
    });
  });

  function updateMiniBars(container, value) {
    const miniBars = container.querySelectorAll('.intensity-mini-bar');
    const level = Math.min(5, Math.max(0, Math.round((value / 100) * 5)));
    miniBars.forEach((bar, index) => {
      bar.classList.toggle('filled', index < level);
    });
  }

  if (closePopup) {
    closePopup.addEventListener('click', () => {
      if (winePopup) winePopup.classList.remove('show');
    });
  }

  if (winePopup) {
    winePopup.addEventListener('click', (e) => {
      if (!winePopup.querySelector('.wine-popup-content').contains(e.target)) {
        winePopup.classList.remove('show');
      }
    });
  }

  // =====================
  // Carregamento Infinito
  // =====================
  const sentinel = document.getElementById('sentinel');
  let isLoading = false;

  const observer = new IntersectionObserver((entries) => {
    const entry = entries[0];
    if (entry.isIntersecting && !isLoading) {
      isLoading = true;
      requestAnimationFrame(() => {
        loadMoreWines();
        isLoading = false;
      });
    }
  }, {
    root: null,
    rootMargin: '600px 0px 800px 0px', // dispara antes de chegar ao fim
    threshold: 0
  });

  // Carregamento inicial
  document.querySelector('.tag-btn[data-filter="all"]').classList.add('active');
  document.querySelector('.country-btn[data-country="all"]').classList.add('active');
  applyFilters();
});
