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
  const tagBtns = document.querySelectorAll('.tag-btn');
  const backToTop = document.getElementById('backToTop');

  // Popup
  const winePopup = document.getElementById('winePopup');
  const closePopup = document.querySelector('.close-popup');
  const popupTitle = document.getElementById('popupTitle');
  const popupHarmonizacao = document.getElementById('popupHarmonizacao');
  const popupComentario = document.getElementById('popupComentario');

  // Seletor para as mini-barras
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
  let currentFilter = 'all';
  let currentSearch = '';
  let filteredCards = Array.from(wineCards); // Inicialmente, todos os cards
  let winesLoaded = 0;
  const winesPerLoad = 5;

  // Função para atualizar a lista de cards filtrados
  function updateFilteredCards() {
    filteredCards = Array.from(wineCards).filter(card => {
      const title = removerAcentos(card.querySelector('h2')?.textContent || '');
      const type = removerAcentos(card.dataset.type || '').toLowerCase();
      const uva = removerAcentos(card.dataset.uva || '').toLowerCase();
      const pais = removerAcentos(card.dataset.pais || '').toLowerCase();

      // Verificar se corresponde à busca
      const matchesSearch = currentSearch ? title.includes(currentSearch) : true;

      // Verificar se corresponde ao filtro de tag
      let matchesFilter = currentFilter === 'all';
      if (!matchesFilter) {
        // Para uvas, verificar cada uma separada por vírgula
        const uvas = uva.split(',').map(u => u.trim());
        matchesFilter = type.includes(currentFilter) || 
                        uvas.some(u => u.includes(currentFilter)) || 
                        pais.includes(currentFilter);
      }

      return matchesSearch && matchesFilter;
    });
  }

  // Função para carregar mais vinhos (apenas os filtrados)
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

  // Função para aplicar filtros e resetar o carregamento
  function applyFilters() {
    // Esconder todos os cards
    wineCards.forEach(card => {
      card.style.display = 'none';
      card.classList.add('hidden');
    });

    // Resetar contagem de carregados
    winesLoaded = 0;

    // Atualizar lista filtrada
    updateFilteredCards();

    // Carregar o primeiro lote
    loadMoreWines();

    // Observar o sentinel novamente se necessário
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
  // FILTRO POR TAGS
  // =====================
  tagBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      currentFilter = btn.dataset.filter.toLowerCase();

      tagBtns.forEach((b) => b.classList.remove('active'));
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

      // Atualizar mini-barras de intensidade (0 a 5 níveis)
      updateMiniBars(barLevezaContainer, card.dataset.leveza || 0);
      updateMiniBars(barSuavidadeContainer, card.dataset.suavidade || 0);
      updateMiniBars(barSecoContainer, card.dataset.seco || 0);
      updateMiniBars(barMaciezContainer, card.dataset.maciez || 0);

      // Comentário exclusivo do sommelier
      const comentario = card.dataset.comentario || 'Um toque especial para elevar sua experiência.';
      if (popupComentario) {
        popupComentario.textContent = comentario;
      } else {
        console.error('Elemento popupComentario não encontrado');
      }

      if (winePopup) winePopup.classList.add('show');
    });
  });

  // Função para atualizar as mini-barras
  function updateMiniBars(container, value) {
    const miniBars = container.querySelectorAll('.intensity-mini-bar');
    const level = Math.min(5, Math.max(0, Math.round((value / 100) * 5))); // Converte 0-100% para 0-5 níveis
    miniBars.forEach((bar, index) => {
      bar.classList.toggle('filled', index < level);
    });
  }

  // Fechar no botão X
  if (closePopup) {
    closePopup.addEventListener('click', () => {
      if (winePopup) winePopup.classList.remove('show');
    });
  }

  // Fechar clicando fora do conteúdo
  if (winePopup) {
    winePopup.addEventListener('click', (e) => {
      if (!winePopup.querySelector('.wine-popup-content').contains(e.target)) {
        winePopup.classList.remove('show');
      }
    });
  }

  // Carregamento Infinito
  const sentinel = document.getElementById('sentinel');
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      loadMoreWines();
    }
  }, { threshold: 0.5 });

  // Carregamento inicial
  document.querySelector('.tag-btn[data-filter="all"]').classList.add('active');
  applyFilters();
});