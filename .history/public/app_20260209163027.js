
function searchbarhistory() {
    const urlInput = document.getElementById('url-input');
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    history.push(urlInput.value);
    localStorage.setItem('searchHistory', JSON.stringify(history));
}

const input = document.getElementById('url-input');
const container = document.getElementById('url-bar-display');

input.addEventListener('focus', () => {
    container.classList.add('active');
});