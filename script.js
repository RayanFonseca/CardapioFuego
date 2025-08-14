const filterSelect = document.getElementById('filtro');
const wineCards = document.querySelectorAll('.wine-card');

filterSelect.addEventListener('change', function(){
    const selectedType = filterSelect.value;

    wineCards.forEach(card=>{
        const wineType = card.getAttribute('data-type');
        if (selectedType ==='Todos' || wineType === selectedType){
            card.hidden = false;
        } else {
            card.hidden = true;
        }
    })
});