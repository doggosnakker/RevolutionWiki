const slides = document.querySelectorAll('.slide');
const dotsContainer = document.querySelector('.dots');
const slideTitle = document.getElementById('slideTitle');
const slideSubtitle = document.getElementById('slideSubtitle');
let current = 0;
const titleEl = document.getElementById('home-title');
const descEl = document.getElementById('home-desc');
const FAV_KEY = 'favRevolutions';

function getFavorites() {
    try {
        const raw = localStorage.getItem(FAV_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

function saveFavorites(arr) {
    try {
        localStorage.setItem(FAV_KEY, JSON.stringify(arr));
    } catch (e) {}
}

function isFavorite(id) {
    if (id === '' || id == null) return false;
    return getFavorites().includes(String(id));
}

function toggleFavorite(id) {
    if (id === '' || id == null) return;
    const arr = getFavorites().map(String);
    const sid = String(id);
    const idx = arr.indexOf(sid);
    if (idx === -1) arr.push(sid);
    else arr.splice(idx, 1);
    saveFavorites(arr);
}

function createFavButton(id) {
    const link = document.createElement('a');
    link.style.cursor = 'pointer';
    link.className = 'fav-link';

    const update = () => {
        const fav = isFavorite(id);
        link.textContent = fav ? '★ aggiungi' : '☆ aggiungi';
    };

    link.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorite(id);
        update();
    });

    update();
    return link;
}


slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.onclick = () => goTo(i);
    dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.dot');

function goTo(n) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = n;
    slides[current].classList.add('active');
    dots[current].classList.add('active');

    slideTitle.textContent = slideContent[current].title;
    slideSubtitle.textContent = slideContent[current].subtitle;
}

function next() {
    goTo((current + 1) % slides.length);
}

setInterval(next, 10000);


function home() {
    fetch('data/home.json')
        .then(res => res.json())
        .then(data => {
            const cardsGrid = document.getElementById('cardsGrid');

            if (titleEl) titleEl.textContent = data.text || '';
            if (descEl) descEl.textContent = data.description || '';

            cardsGrid.innerHTML = '';

            if (Array.isArray(data.cards)) {
                data.cards.forEach(item => {
                    const card = document.createElement('article');
                    card.className = 'card-item';
                    card.tabIndex = 0;
                    card.style.cursor = 'pointer';

                    const targetId = item.revId ?? item.id ?? '';
                    const goToRev = () => {
                        if (targetId !== '') {
                            window.location.href = `rivoluzione.html?id=${encodeURIComponent(targetId)}`;
                        }
                    };
                    card.addEventListener('click', goToRev);
                    card.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') goToRev();
                    });

                    if (targetId !== '') {
                        const favContainer = document.createElement('div');
                        favContainer.className = 'fav-container';
                        const favBtn = createFavButton(targetId);
                        favContainer.appendChild(favBtn);
                        card.appendChild(favContainer);
                    }

                    if (item.image) {
                        const img = document.createElement('img');
                        img.src = item.image;
                        img.alt = item.title || '';
                        img.loading = 'lazy';
                        card.appendChild(img);
                    }

                    if (item.title) {
                        const h3 = document.createElement('h3');
                        h3.textContent = item.title;
                        card.appendChild(h3);
                    }

                    if (item.description) {
                        const p = document.createElement('p');
                        p.textContent = item.description;
                        card.appendChild(p);
                    }

                    cardsGrid.appendChild(card);
                });
            }
        })
}



document.addEventListener('DOMContentLoaded', () => {
    const dd = document.getElementById('revolutionsDropdown');
    if (dd) {
        fetch('data/revolutions.json')
            .then(r => r.json())
            .then(data => {
                dd.innerHTML = '';
                const params = new URLSearchParams(window.location.search);
                const currentId = params.get('id');

             
    
                const list = data.revolutions || [];
                list.forEach(r => {
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.className = 'dropdown-item';
                    a.href = `rivoluzione.html?id=${encodeURIComponent(r.id)}`;
                    a.textContent = r.title + (r.subtitle ? ` (${r.subtitle})` : '');
                    if (currentId !== null && String(r.id) === String(currentId)) {
                        a.classList.add('active');
                    }
                    li.appendChild(a);
                    dd.appendChild(li);
                });

                if (currentId !== null) {
                    const currentRev = list.find(x => String(x.id) === String(currentId));
                    if (currentRev && Array.isArray(currentRev.content) && currentRev.content.length) {
                        const sectDivider = document.createElement('li');
                        sectDivider.innerHTML = '<hr class="dropdown-divider">';
                        dd.appendChild(sectDivider);
                        const headerLi = document.createElement('li');
                        const header = document.createElement('h6');
                        header.className = 'dropdown-header';
                        header.textContent = 'Sezioni';
                        headerLi.appendChild(header);
                        dd.appendChild(headerLi);
                        currentRev.content.forEach((c, idx) => {
                            const sli = document.createElement('li');
                            const sa = document.createElement('a');
                            sa.className = 'dropdown-item';
                            const label = (c.type === 'title' && c.text) ? c.text : `Paragrafo ${idx+1}`;
                            sa.href = `#sec-${idx}`;
                            sa.textContent = label;
                            sli.appendChild(sa);
                            dd.appendChild(sli);
                        });
                    }
                }

                const divider = document.createElement('li');
                divider.innerHTML = '<hr class="dropdown-divider">';
                dd.appendChild(divider);
                const favLi = document.createElement('li');
                const favA = document.createElement('a');
                favA.className = 'dropdown-item';
                favA.href = 'favorites.html';
                favA.innerHTML = '<span class="material-symbols-outlined">bookmarks</span> Preferiti';
                favLi.appendChild(favA);
                dd.appendChild(favLi);
            })
    }

    if (document.getElementById('home-section')) {
        home();
    }
});
