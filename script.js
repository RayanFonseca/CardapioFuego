// Função para remover acentos
function removerAcentos(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------
  // Seletores principais
  // --------------------------
  const searchInput = document.getElementById('searchInput');
  const wineCards = document.querySelectorAll('.wine-card');
  const suggestionList = document.getElementById('wineSuggestion');
  const tagBtns = document.querySelectorAll('.tag-btn'); // Botões de tipo
  const countryBtns = document.querySelectorAll('.country-btn'); // Novos botões de país
  const backToTop = document.getElementById('backToTop');

  // Popup (inalterado)
  const winePopup = document.getElementById('winePopup');
  const closePopup = document.querySelector('.close-popup');
  const popupTitle = document.getElementById('popupTitle');
  const popupHarmonizacao = document.getElementById('popupHarmonizacao');
  const popupComentario = document.getElementById('popupComentario');

  // Seletor para as mini-barras (inalterado)
  const barLevezaContainer = document.querySelector('.intensity-item:nth-child(1) .intensity-bar-container');
  const barSuavidadeContainer = document.querySelector('.intensity-item:nth-child(2) .intensity-bar-container');
  const barSecoContainer = document.querySelector('.intensity-item:nth-child(3) .intensity-bar-container');
  const barMaciezContainer = document.querySelector('.intensity-item:nth-child(4) .intensity-bar-container');

  // =====================
  // AUTOCOMPLETE PESQUISA (inalterado)
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
  let currentType = 'all'; // Filtro de tipo (tinto, branco, etc.)
  let currentCountry = 'all'; // Novo: Filtro de país
  let currentSearch = '';
  let filteredCards = Array.from(wineCards); // Inicialmente, todos os cards
  let winesLoaded = 0;
  const winesPerLoad = 5;

  // Função para atualizar a lista de cards filtrados
  function updateFilteredCards() {
    filteredCards = Array.from(wineCards).filter(card => {
      const title = removerAcentos(card.querySelector('h2')?.textContent || '');
      const type = removerAcentos(card.dataset.type || '');
      const pais = removerAcentos(card.dataset.pais || '');

      // Verificar se corresponde à busca
      const matchesSearch = currentSearch ? title.includes(currentSearch) : true;

      // Verificar filtro de tipo
      const matchesType = currentType === 'all' || type === currentType;

      // Verificar filtro de país
      const matchesCountry = currentCountry === 'all' || pais === currentCountry;

      return matchesSearch && matchesType && matchesCountry;
    });
  }

  // Função para carregar mais vinhos (inalterado)
  function loadMoreWines() {
    const nextWines = filteredCards.slice(winesLoaded, winesLoaded + winesPerLoad);
    nextWines.forEach(card => {
      card.style.display = 'block';
      card.classList.remove('hidden');
    });
    winesLoaded += nextWines.length;

    if (winesLoaded >= filteredCards.length) {
      observer.unobserve(sentinel);
    }
  }

  // Função para aplicar filtros e resetar o carregamento (inalterado)
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
  // EVENTO DE BUSCA (inalterado)
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
  // FILTRO POR TIPOS (tag-btn)
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
  // NOVO: FILTRO POR PAÍSES (country-btn)
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
  // BOTÃO VOLTAR AO TOPO (inalterado)
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
  // POPUP DOS VINHOS (inalterado)
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
      } else {
        console.error('Elemento popupComentario não encontrado');
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

  // Carregamento Infinito (inalterado)
  const sentinel = document.getElementById('sentinel');
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      loadMoreWines();
    }
  }, { threshold: 0.5 });

  // Carregamento inicial
  document.querySelector('.tag-btn[data-filter="all"]').classList.add('active');
  document.querySelector('.country-btn[data-country="all"]').classList.add('active');
  applyFilters();
});
function sortWines() {
  const container = document.querySelector(".container"); // onde ficam os cards
  const cards = Array.from(container.querySelectorAll(".wine-card"));

  cards.sort((a, b) => {
    // 1. Ordena pelo tipo (tinto, rosé, branco, etc.)
    const typeA = a.dataset.type.toLowerCase();
    const typeB = b.dataset.type.toLowerCase();
    if (typeA !== typeB) return typeA.localeCompare(typeB);

    // 2. Ordena pelo país
    const countryA = a.dataset.pais.toLowerCase();
    const countryB = b.dataset.pais.toLowerCase();
    if (countryA !== countryB) return countryA.localeCompare(countryB);

    // 3. Ordena pelo nome do vinho
    const nameA = a.querySelector("h2").textContent.toLowerCase();
    const nameB = b.querySelector("h2").textContent.toLowerCase();
    return nameA.localeCompare(nameB);
  });

  // Recoloca os cards no container na nova ordem
  cards.forEach(card => container.appendChild(card));
}

// Executa assim que a página carregar
document.addEventListener("DOMContentLoaded", sortWines);
