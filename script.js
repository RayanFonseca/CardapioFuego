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

  searchInput.addEventListener('input', (e) => {
    const term = removerAcentos(e.target.value.trim());
    console.log('Termo digitado (sem acentos):', term);

    wineCards.forEach((card) => {
      const titleWithAccents = card.querySelector('h2')?.textContent || '';
      const title = removerAcentos(titleWithAccents);
      console.log('Título do card (sem acentos):', title);
      if (title.includes(term)) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchInput.value = '';
      searchInput.blur();
    }
  });

  // =====================
  // FILTRO POR TAGS
  // =====================
  tagBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filterValue = btn.dataset.filter.toLowerCase();
      console.log('Filtro aplicado:', filterValue);

      tagBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      wineCards.forEach((card) => {
        const cardType = card.dataset.type.toLowerCase();
        const cardUva = card.dataset.uva.toLowerCase();
        const cardPais = card.dataset.pais.toLowerCase();
        console.log('Card:', card.querySelector('h2').textContent, 'Type:', cardType, 'Uva:', cardUva, 'Pais:', cardPais);

        card.classList.add('hidden');

        if (
          filterValue === 'all' ||
          cardType === filterValue ||
          cardUva === filterValue ||
          cardPais === filterValue
        ) {
          card.classList.remove('hidden');
        }
      });
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
      console.log('Clicou no card:', card.querySelector('h2').textContent);
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
  let winesLoaded = 5;
  const winesPerLoad = 5;

  function loadMoreWines() {
    const totalWines = wineCards.length;
    const nextWines = Array.from(wineCards).slice(winesLoaded, winesLoaded + winesPerLoad);
    nextWines.forEach(card => card.style.display = 'block');
    winesLoaded += nextWines.length;

    if (winesLoaded >= totalWines) {
      observer.unobserve(sentinel);
    }
  }

  const sentinel = document.getElementById('sentinel');
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      loadMoreWines();
    }
  }, { threshold: 0.5 });

  observer.observe(sentinel);

  wineCards.forEach((card, index) => {
    if (index >= 5) card.style.display = 'none';
  });
});