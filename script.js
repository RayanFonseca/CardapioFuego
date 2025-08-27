document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const wineCards = document.querySelectorAll('.wine-card');
    const suggestionList = document.getElementById('wineSuggestion');
    const tagBtns = document.querySelectorAll('.tag-btn');


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
    
    });
