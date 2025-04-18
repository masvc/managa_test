// お気に入り管理の機能
const FAVORITES_KEY = 'manga_favorites';

function getFavorites() {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
}

function addToFavorites(manga) {
    const favorites = getFavorites();
    if (!favorites.some(fav => fav.mal_id === manga.mal_id)) {
        favorites.push(manga);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
}

function removeFromFavorites(mangaId) {
    const favorites = getFavorites();
    const updatedFavorites = favorites.filter(manga => manga.mal_id !== mangaId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
}

function isFavorite(mangaId) {
    const favorites = getFavorites();
    return favorites.some(manga => manga.mal_id === mangaId);
}

async function fetchManga(searchQuery = '') {
    try {
        const baseUrl = 'https://api.jikan.moe/v4/manga';
        const url = searchQuery 
            ? `${baseUrl}?q=${encodeURIComponent(searchQuery)}&sfw=true`
            : 'https://api.jikan.moe/v4/top/manga?limit=20';
            
        const response = await fetch(url);
        const data = await response.json();
        displayManga(data.data);
    } catch (error) {
        console.error('Failed to fetch manga data:', error);
        showErrorMessage();
    }
}

function showErrorMessage() {
    const errorMessage = '漫画データの取得に失敗しました。しばらく時間をおいて再度お試しください。';
    alert(errorMessage);
}

function createMangaCard(manga, isFavoriteView = false) {
    const mangaCard = document.createElement('div');
    mangaCard.className = 'manga-card';
    
    const authorName = manga.authors[0]?.name || '不明';
    const publisherName = manga.serializations[0]?.name || '不明';
    const score = manga.score ? `評価: ${manga.score}` : '評価: なし';
    const isFav = isFavorite(manga.mal_id);
    
    mangaCard.innerHTML = `
        <img src="${manga.images.jpg.image_url}" alt="${manga.title}">
        <div class="manga-info">
            <h3>${manga.title}</h3>
            <p>作者: ${authorName}</p>
            <p>連載: ${publisherName}</p>
            <p>${score}</p>
            <button class="favorite-btn ${isFav ? 'active' : ''}" data-id="${manga.mal_id}">
                ${isFav ? '★ お気に入り解除' : '☆ お気に入り追加'}
            </button>
        </div>
    `;
    
    const favoriteBtn = mangaCard.querySelector('.favorite-btn');
    favoriteBtn.addEventListener('click', () => {
        if (isFavorite(manga.mal_id)) {
            removeFromFavorites(manga.mal_id);
            if (isFavoriteView) {
                mangaCard.remove();
                if (getFavorites().length === 0) {
                    displayNoFavorites();
                }
            }
        } else {
            addToFavorites(manga);
        }
        updateFavoriteButton(favoriteBtn, manga.mal_id);
    });
    
    return mangaCard;
}

function updateFavoriteButton(button, mangaId) {
    const isFav = isFavorite(mangaId);
    button.textContent = isFav ? '★ お気に入り解除' : '☆ お気に入り追加';
    button.classList.toggle('active', isFav);
}

function displayManga(mangaList) {
    const mangaGrid = document.getElementById('mangaList');
    mangaGrid.innerHTML = '';

    if (mangaList.length === 0) {
        mangaGrid.innerHTML = '<p class="no-results">検索結果が見つかりませんでした。</p>';
        return;
    }

    mangaList.forEach(manga => {
        const mangaCard = createMangaCard(manga);
        mangaGrid.appendChild(mangaCard);
    });
}

function displayFavorites() {
    const mangaGrid = document.getElementById('mangaList');
    mangaGrid.innerHTML = '';
    
    const favorites = getFavorites();
    
    if (favorites.length === 0) {
        displayNoFavorites();
        return;
    }
    
    favorites.forEach(manga => {
        const mangaCard = createMangaCard(manga, true);
        mangaGrid.appendChild(mangaCard);
    });
}

function displayNoFavorites() {
    const mangaGrid = document.getElementById('mangaList');
    mangaGrid.innerHTML = '<p class="no-results">お気に入りの漫画はありません。</p>';
}

// 検索機能の実装
function setupSearch() {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    const showFavoritesButton = document.getElementById('showFavoritesButton');
    const showAllButton = document.getElementById('showAllButton');

    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        fetchManga(query);
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            fetchManga(query);
        }
    });

    showFavoritesButton.addEventListener('click', () => {
        displayFavorites();
    });

    showAllButton.addEventListener('click', () => {
        fetchManga();
    });
}

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', () => {
    fetchManga();
    setupSearch();
}); 