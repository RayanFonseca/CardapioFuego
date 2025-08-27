// Certifique-se de salvar este arquivo com codificação UTF-8
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const wineCards = document.querySelectorAll('.wine-card');
    const suggestionList = document.getElementById('wineSuggestion');
    const tagBtns = document.querySelectorAll('.tag-btn');
    const backToTop = document.getElementById('backToTop');
    const winePopup = document.getElementById('winePopup');
    const popupTitle = document.getElementById('popupTitle');
    const popupHarmonizacao = document.getElementById('popupHarmonizacao');
    const barLeveza = document.getElementById('barLeveza');
    const barSuavidade = document.getElementById('barSuavidade');
    const barSeco = document.getElementById('barSeco');
    const barMaciez = document.getElementById('barMaciez');
    const closePopup = document.querySelector('.close-popup');

    if (!searchInput) {
        console.error('Erro: Elemento #searchInput não encontrado.');
        return;
    }

    // Depuração: Verifica se o script está carregando
    console.log('Script carregado com sucesso');

    wineCards.forEach((card) => {
        const title = card.querySelector('h2')?.textContent || '';
        if (title) {
            const option = document.createElement('option');
            option.value = title;
            suggestionList.appendChild(option);
        }
    });

    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.trim().toLowerCase();
        wineCards.forEach((card) => {
            const title = card.querySelector('h2')?.textContent.toLowerCase() || '';
            if (title.includes(term)) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    });

    tagBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const filterValue = btn.dataset.filter.toLowerCase();
            tagBtns.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            wineCards.forEach((card) => {
                const cardType = card.dataset.type.toLowerCase();
                const cardUva = card.dataset.uva.toLowerCase();
                const cardPais = card.dataset.pais.toLowerCase();
                if (filterValue === 'all' || cardType === filterValue || cardUva === filterValue || cardPais === filterValue) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    wineCards.forEach((card) => {
        card.addEventListener('click', () => {
            popupTitle.textContent = card.querySelector('h2').textContent;
            popupHarmonizacao.textContent = card.dataset.harmonizacao || 'Não especificado';
            barLeveza.style.width = `${card.dataset.leveza || 50}%`;
            barSuavidade.style.width = `${card.dataset.suavidade || 50}%`;
            barSeco.style.width = `${card.dataset.seco || 50}%`;
            barMaciez.style.width = `${card.dataset.macie || 50}%`;
            winePopup.classList.add('show');
            console.log('Popup aberto para:', card.querySelector('h2').textContent); // Depuração
            console.log('Recurso 404 pode estar afetando:', document.querySelectorAll('img[src="./imagens/"]').length); // Depuração de imagens
        });
    });

    closePopup.addEventListener('click', () => {
        winePopup.classList.remove('show');
    });

    window.addEventListener('click', (e) => {
        if (!winePopup.contains(e.target) && e.target !== winePopup) {
            winePopup.classList.remove('show');
        }
    });
});