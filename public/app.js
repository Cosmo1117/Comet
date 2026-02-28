const apps = document.getElementById("app-select-popup");
const appbtn = document.getElementById("sidebar-app-select");

const toggleapps = () => {
    if (apps) {
        apps.classList.toggle('open');
    }
};

if (appbtn) {
    appbtn.addEventListener('click', toggleapps)
}