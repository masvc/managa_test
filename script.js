async function fetchManga() {
    try {
        const response = await fetch('https://api.jikan.moe/v4/top/manga?limit=20');
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

function displayManga(mangaList) {
    const mangaGrid = document.getElementById('mangaList');
    mangaGrid.innerHTML = '';

    mangaList.forEach(manga => {
        const mangaCard = document.createElement('div');
        mangaCard.className = 'manga-card';
        
        const authorName = manga.authors[0]?.name || '不明';
        const publisherName = manga.serializations[0]?.name || '不明';
        const score = manga.score ? `評価: ${manga.score}` : '評価: なし';
        
        mangaCard.innerHTML = `
            <img src="${manga.images.jpg.image_url}" alt="${manga.title}">
            <div class="manga-info">
                <h3>${manga.title}</h3>
                <p>作者: ${authorName}</p>
                <p>連載: ${publisherName}</p>
                <p>${score}</p>
            </div>
        `;
        
        mangaGrid.appendChild(mangaCard);
    });
}

// ページ読み込み時に漫画データを取得
document.addEventListener('DOMContentLoaded', fetchManga); 