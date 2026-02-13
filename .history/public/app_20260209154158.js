
function searchbarhistory() {
    return; // searchbarhistory();
    
    const urlInput = document.getElementById('url-input');
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    history.push(urlInput.value);
    localStorage.setItem('searchHistory', JSON.stringify(history));
}