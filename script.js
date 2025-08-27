document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const wineCards = document.querySelectorAll('.wine-card');
    const suggestionList = document.getElementById('wineSuggestion');
    const tagBtns = document.querySelectorAll('.tag-btn');
    const filterPanel = document.getElementById('filterPanel');
    const closeFilterPanel = document.getElementById('closeFilterPanel');
    const applyFilters = document.getElementById('applyFilters');
    const typeFilter = document.getElementById('typeFilter');
    const uvaFilter = document.getElementById('uvaFilter');
    const paisFilter = document.getElementById('paisFilter');

    if (!searchInput) {
        console.error('Erro: Elemento #searchInput não encontrado.');
        return;
    }

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
        console.log('Buscando por:', term);

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
            console.log('Filtrando por tag:', filterValue);

            tagBtns.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');

            wineCards.forEach((card) => {
                const cardType = card.dataset.type.toLowerCase();
                const cardUva = card.dataset.uva.toLowerCase();
                const cardPais = card.dataset.pais.toLowerCase();

                if (filterValue === 'all' ||
                    cardType === filterValue ||
                    cardUva === filterValue ||
                    cardPais === filterValue) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // Abrir/Fechar Painel de Filtros
    document.getElementById('filterBtn')?.remove(); // Removido botão antigo se existir
    const filterBtn = document.createElement('button');
    filterBtn.id = 'filterBtn';
    filterBtn.className = 'filter-btn';
    filterBtn.innerHTML = '⚙️'; // Emoji de engrenagem
    filterBtn.addEventListener('click', () => filterPanel.classList.toggle('hidden'));
    document.querySelector('header').appendChild(filterBtn);

    closeFilterPanel.addEventListener('click', () => filterPanel.classList.add('hidden'));

    applyFilters.addEventListener('click', () => {
        const type = typeFilter.value.toLowerCase();
        const uva = uvaFilter.value.toLowerCase();
        const pais = paisFilter.value.toLowerCase();

        wineCards.forEach((card) => {
            const cardType = card.dataset.type.toLowerCase();
            const cardUva = card.dataset.uva.toLowerCase();
            const cardPais = card.dataset.pais.toLowerCase();

            if ((type === '' || cardType === type) &&
                (uva === '' || cardUva === uva) &&
                (pais === '' || cardPais === pais)) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
        filterPanel.classList.add('hidden');
    });
});