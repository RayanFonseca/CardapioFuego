// Função para remover acentos
function removerAcentos(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------
  // Seletores principais
  // --------------------------
  const searchInput     = document.getElementById('searchInput');
  const wineCards       = document.querySelectorAll('.wine-card');
  const suggestionList  = document.getElementById('wineSuggestion');
  const tagBtns         = document.querySelectorAll('.tag-btn');
  const backToTop       = document.getElementById('backToTop');

  // Popup
  const winePopup           = document.getElementById('winePopup');
  const closePopup          = document.querySelector('.close-popup');
  const popupTitle          = document.getElementById('popupTitle');
  const popupHarmonizacao   = document.getElementById('popupHarmonizacao');
  const barLeveza           = document.getElementById('barLeveza');
  const barSuavidade        = document.getElementById('barSuavidade');
  const barSeco             = document.getElementById('barSeco');
  const barMaciez           = document.getElementById('barMaciez');

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
  console.log('Termo digitado (sem acentos):', term); // Depuração

  wineCards.forEach((card) => {
    const titleWithAccents = card.querySelector('h2')?.textContent || ''; // Título original
    const title = removerAcentos(titleWithAccents); // Remove acentos do título
    console.log('Título do card (sem acentos):', title); // Depuração
    if (title.includes(term)) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
});

  // =====================
  // FILTRO POR TAGS
  // =====================
  tagBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filterValue = btn.dataset.filter.toLowerCase();

      tagBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      wineCards.forEach((card) => {
        const cardType = card.dataset.type.toLowerCase();
        const cardUva  = card.dataset.uva.toLowerCase();
        const cardPais = card.dataset.pais.toLowerCase();

        if (
          filterValue === 'all' ||
          cardType === filterValue ||
          cardUva === filterValue ||
          cardPais === filterValue
        ) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
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
      popupTitle.textContent = card.querySelector('h2').textContent;
      popupHarmonizacao.textContent = card.dataset.harmonizacao || 'Não informado';

      // Barras de intensidade (com fallback de 0 se não houver dado)
      barLeveza.style.width    = `${card.dataset.leveza   || 0}%`;
      barSuavidade.style.width = `${card.dataset.suavidade || 0}%`;
      barSeco.style.width      = `${card.dataset.seco     || 0}%`;
      barMaciez.style.width    = `${card.dataset.maciez   || 0}%`;

      winePopup.classList.add('show');
    });
  });

  // Fechar no botão X
  closePopup.addEventListener('click', () => {
    winePopup.classList.remove('show');
  });

  // Fechar clicando fora do conteúdo
  winePopup.addEventListener('click', (e) => {
    if (!winePopup.querySelector('.wine-popup-content').contains(e.target)) {
      winePopup.classList.remove('show');
    }
  });
});
