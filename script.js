document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const wineCards = document.querySelectorAll('.wine-card');
    const filterBtn = document.getElementById('filterBtn');
    const suggestionList = document.getElementById("wineSuggestion");
    const tagBTns = document.querySelectorAll(".tag-btn");
    if (!searchInput) {
        console.error('Erro: Elemento #searchInput não encontrado.');
        return;
    }
        wineCards.forEach((card) => {
           const title = card.querySelector('h2')?.textContent || '';
           if (title){
            const option = document.createElement('option');
            option.value = title;
            suggestionList.appendChild(option);
           }
        });
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.trim().toLowerCase();
            console.log('Buscando Por:', term);

            wineCards.forEach((card)=>{
                const title = card.querySelector('h2')?.textContent.toLowerCase() || '';
                const desc = card.querySelector('p')?.textContent.toLowerCase() || '';
                const haystack = `${title} ${desc}`;

                
                if (haystack.includes(term)){
                    card.classList.remove('hidden');
                }else{
                    card.classList.add('hidden');
                }
            });
        });
       
        tagBTns.forEach((btn)=>{
            btn.addEventListener('click', ()=>{
                const selectedType = btn.dataset.type.toLowerCase();
                console.log('Filtrando por tag:', selectedType);

                tagBTns.forEach((b)=> b.classList.remove('active'));
                btn.classList.add('active');

                wineCards.forEach((card)=>{
                    const cardType = card.dataset.type.toLowerCase();

                    if (selectedType === 'all' || cardType === selectedType){
                        card.classList.remove('hidden');
                    }else {
                        card.classList.add('hidden');
                    }
                });
            });
        });
});