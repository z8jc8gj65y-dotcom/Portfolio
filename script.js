const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxTitolo = document.getElementById('lightbox-titolo');
const lightboxTesto = document.getElementById('lightbox-testo');
const immagini = document.querySelectorAll('.gallery img, .murales img');
let indiceCorrente = 0;

// Mostra l'immagine in una certa posizione, con titolo e testo
function mostra(indice) {
    indiceCorrente = (indice + immagini.length) % immagini.length;
    const img = immagini[indiceCorrente];

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;

    const titolo = img.dataset.titolo || img.alt;
    const testo = img.dataset.testo || '';

    lightboxTitolo.textContent = titolo;
    lightboxTesto.textContent = testo;
    lightboxTitolo.hidden = !titolo;
    lightboxTesto.hidden = !testo;
}

function apri(indice) {
    mostra(indice);
    lightbox.classList.add('aperta');
}

function chiudi() {
    lightbox.classList.remove('aperta');
}

// Clic su una miniatura
immagini.forEach(function (img, indice) {
    img.addEventListener('click', function () {
        apri(indice);
    });
});

// Frecce
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

// Murales: mostro poche righe e poi "Mostra altre"
const murales = document.querySelector('.murales');
const boxMurales = document.getElementById('murales-box');
const btnAltre = document.getElementById('mostra-altre');

if (murales && boxMurales && btnAltre) {
    const RIGHE_DESKTOP = 4;
    const RIGHE_TELEFONO = 6;
    let aperto = false;

    // Calcola l'altezza da mostrare, tagliando solo tra una riga e l'altra
    function calcolaAltezza() {
        const stile = getComputedStyle(murales);
        const gap = parseFloat(stile.rowGap);
        const colonne = stile.gridTemplateColumns.split(' ').length;
        const hRiga = (murales.clientWidth - (colonne - 1) * gap) / colonne;
        const base = murales.getBoundingClientRect().top;
        const celle = Array.from(murales.children);

        const telefono = window.matchMedia('(max-width: 600px)').matches;
        let righe = telefono ? RIGHE_TELEFONO : RIGHE_DESKTOP;

        // Se una immagine verrebbe tagliata a metà, mostro una riga in meno
        while (righe > 1) {
            const y = righe * hRiga + (righe - 1) * gap;
            const tagliata = celle.some(function (el) {
                const r = el.getBoundingClientRect();
                return r.top - base < y - 1 && r.bottom - base > y + 1;
            });
            if (!tagliata) break;
            righe--;
        }

        return righe * hRiga + (righe - 1) * gap;
    }

    function aggiorna() {
        if (aperto) {
            murales.style.maxHeight = 'none';
            return;
        }
        const altezza = calcolaAltezza();
        murales.style.maxHeight = altezza + 'px';
        const cisonoAltre = murales.scrollHeight > altezza + 1;
        btnAltre.hidden = !cisonoAltre;
        boxMurales.classList.toggle('chiuso', cisonoAltre);
    }

    btnAltre.addEventListener('click', function () {
        aperto = !aperto;
        btnAltre.textContent = aperto ? 'Mostra meno ↑' : 'Mostra altre ↓';
        btnAltre.setAttribute('aria-expanded', aperto);
        boxMurales.classList.toggle('chiuso', !aperto);
        aggiorna();
        if (!aperto) {
            boxMurales.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    window.addEventListener('load', aggiorna);
    window.addEventListener('resize', aggiorna);
    aggiorna();
}
// Effetti manga: onomatopea quando passo il mouse su un'illustrazione
(function () {
    // Solo dove esiste il mouse (sul telefono l'hover resterebbe "incollato")
    if (!window.matchMedia('(hover: hover)').matches) return;

    const suoni = ['ZUUM!', 'DON!', 'BAM!', 'FUUU!', 'ゴゴゴ', 'ドン!', 'バン!'];
    const bersagli = document.querySelectorAll('.gallery img, .griglia article');

    const suono = document.createElement('span');
    suono.className = 'onomatopea';
    suono.setAttribute('aria-hidden', 'true');
    document.body.appendChild(suono);

    let ultimo = -1;

    function nascondi() {
        suono.classList.remove('visibile');
    }

    bersagli.forEach(function (el) {
        el.addEventListener('mouseenter', function () {
            // Scelgo un suono diverso dall'ultimo
            let i;
            do {
                i = Math.floor(Math.random() * suoni.length);
            } while (i === ultimo);
            ultimo = i;

            // Lo metto nell'angolo in alto a sinistra dell'elemento
            const r = el.getBoundingClientRect();
            suono.textContent = suoni[i];
            suono.style.left = (r.right - 80) + 'px';
            suono.style.top = (r.top + 14) + 'px';
            suono.style.setProperty('--rot', (Math.random() * 16 - 8) + 'deg');

            // Riavvio l'animazione
            suono.classList.remove('visibile');
            void suono.offsetWidth;
            suono.classList.add('visibile');
        });

        el.addEventListener('mouseleave', nascondi);
    });

    window.addEventListener('scroll', nascondi, { passive: true });
})();