const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const immagini = document.querySelectorAll('.gallery img');
let indiceCorrente = 0;

// Mostra l'immagine che si trova in una certa posizione
function mostra(indice) {
    // Se supero la fine ricomincio dall'inizio, e viceversa
    indiceCorrente = (indice + immagini.length) % immagini.length;
    const img = immagini[indiceCorrente];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
}

function apri(indice) {
    mostra(indice);
    lightbox.classList.add('aperta');
}

function chiudi() {
    lightbox.classList.remove('aperta');
}

// Clic su una miniatura: apro la lightbox su quell'immagine
immagini.forEach(function (img, indice) {
    img.addEventListener('click', function () {
        apri(indice);
    });
});

// Frecce: stopPropagation evita che il clic chiuda la lightbox
document.getElementById('prev').addEventListener('click', function (e) {
    e.stopPropagation();
    mostra(indiceCorrente - 1);
});

document.getElementById('next').addEventListener('click', function (e) {
    e.stopPropagation();
    mostra(indiceCorrente + 1);
});

// Clic sullo sfondo: chiudo
lightbox.addEventListener('click', chiudi);

// Tastiera
document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('aperta')) return;

    if (e.key === 'Escape') chiudi();
    if (e.key === 'ArrowLeft') mostra(indiceCorrente - 1);
    if (e.key === 'ArrowRight') mostra(indiceCorrente + 1);
});

// Swipe (dito o mouse)
let inizioX = 0;

lightbox.addEventListener('pointerdown', function (e) {
    inizioX = e.clientX;
});

lightbox.addEventListener('pointerup', function (e) {
    const differenza = e.clientX - inizioX;

    if (Math.abs(differenza) < 50) return;

    if (differenza < 0) {
        mostra(indiceCorrente + 1);
    } else {
        mostra(indiceCorrente - 1);
    }
});