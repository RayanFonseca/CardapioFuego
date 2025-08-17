document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const wineCards = document.querySelectorAll('.wine-card');
    const filterBtn = document.getElementById('filterBtn');

    if (!searchInput) {
        console.error('Erro: Elemento #searchInput não encontrado.');
        return;
    }
    if (!filterBtn) {
        console.error('Erro: Elemento #filterBtn não encontrado.');
        return;
    }

    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.trim().toLowerCase();
        console.log('Buscando por:', term);

        wineCards.forEach((card) => {
            const title = card.querySelector('h2')?.textContent.toLowerCase() || '';
            const desc = card.querySelector('p')?.textContent.toLowerCase() || '';
            const haystack = `${title} ${desc}`;

            if (haystack.includes(term)) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    });

    filterBtn.addEventListener('click', () => {
        const panel = document.getElementById('filterPanel');
        panel.classList.toggle('hidden');
        console.log('Painel de filtros toggled');
    });

    document.getElementById('applyFilters').addEventListener('click', () => {
        const type = document.getElementById('typeFilter').value.toLowerCase();
        const uva = document.getElementById('uvaFilter').value.toLowerCase();
        const pais = document.getElementById('paisFilter').value.toLowerCase();
        console.log('Aplicando filtros:', { type, uva, pais });

        // Reinicializa todos os cards
        wineCards.forEach((card) => card.classList.remove('hidden'));

        wineCards.forEach((card) => {
            const cardType = card.querySelector('p')?.textContent.toLowerCase() || '';
            const cardUva = card.querySelectorAll('p')[1]?.textContent.toLowerCase().replace('uva: ', '') || '';
            const cardPais = card.querySelectorAll('p')[2]?.textContent.toLowerCase().replace('país: ', '') || '';
            console.log('Card Values:', { cardType, cardUva, cardPais });

            const hasFilters = type !== '' || uva !== '' || pais !== '';
            const matches = (!hasFilters || // Mostra todos se não há filtros
                            (type === '' || cardType.includes(type)) &&
                            (uva === '' || cardUva.includes(uva)) &&
                            (pais === '' || cardPais.includes(pais)));

            if (matches) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });

        document.getElementById('filterPanel').classList.add('hidden');
    });
});