/* javascript for comet new tab page */

//wallpaper change modal toggle
const wpChangeBtn = document.getElementById("wallpaper-change");
const modalBackdrop = document.getElementById("modal-backdrops");
const wpChangeModal = document.getElementById("wallpaper-change-overlay");
const wpChangeModalX = document.getElementById("placeholder");

const togglewpModal = () => {
    if (wpChangeModal && modalBackdrop) {
            wpChangeModal.classList.toggle('open');
            modalBackdrop.classList.toggle('openModal')
    }
}

if (wpChangeBtn) {
    wpChangeBtn.addEventListener('click', togglewpModal)
}

if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) {
            togglewpModal();
        }
    });
}

let userPreferences = {
    units: 'celsius',
    clockType: 24,
}

//weather

async function getWeather() {
    try {
        const ipResponse = await fetch('https://ipapi.co/json/');
        const location = await ipResponse.json();

        const country = location.country_code;

        const countryDefaults = {
            'US': { units: 'fahrenheit', clock: 12 },
            'GB': { units: 'celsius', clock: 24 },
            'CA': { units: 'celsius', clock: 12 },
            'default': { units: 'celsius', clock: 24 },
        }
        const settings = countryDefaults[country] || countryDefaults['default'];

        userPreferences.units = settings.units;
        userPreferences.clock = settings.clock;

        const lat = location.latitude;
        const lon = location.longitude;

        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=${userPreferences.units}`
        );
        const weatherData = await weatherResponse.json();

        const temp = Math.round(weatherData.current_weather.temperature);
        const unit = userPreferences.units === 'fahrenheit' ? '°F' : '°C';
        document.getElementById('weather').textContent = `${temp}${unit}`;
        
    } catch (error) {
        console.error("Weather failed:", error);
        document.getElementById('weather').textContent = "Weather Unavailable";
    }
}

/*clock
its butchered cause i couldnt figure out why the auto format wasnt working so i just did random shit till it worked*/


let lastTimeString = null;

function updateTime() {
    const time = new Date();
    let hours = time.getHours();
    const minutes = time.getMinutes().toString().padStart(2, '0');

    let timeString = "";

    if (userPreferences.clock === 12) {
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        timeString = `${hours}:${minutes} ${ampm}`;
    } else {
        hours = hours.toString().padStart(2, '0');
        timeString = `${hours}:${minutes}`;
    }

    if (timeString !== lastTimeString) {
        document.getElementById('time').textContent = timeString;
        lastTimeString = timeString;
    }
}

updateTime();
setInterval(updateTime, 1000);
document.addEventListener("DOMContentLoaded", getWeather);

// wallpaper drag + drop/upload

const dropArea = document.getElementById('wallpaper-overlay-bottom');
const uploadBtn = document.getElementById('wallpaper-upload');
const preview = document.getElementById('wallpaper-preview');

const uploadLabel = document.getElementById('wallpaper-upload-zone');

dropArea.addEventListener("click", (e) => {
    if (!uploadLabel.contains(e.target)) uploadBtn.click();
});

["dragover", "dragleave", "drop"].forEach(type => {
    dropArea.addEventListener(type, (e) => {
        e.preventDefault();
        if (type === "dragover") dropArea.classList.add("fileover");
        else dropArea.classList.remove("fileover");
        if (type === "drop" && e.dataTransfer.files.length) {
            imageHandler(e.dataTransfer.files[0]);
        }
    });
});

uploadBtn.addEventListener("change", () => {
    if (uploadBtn.files.length) {
        imageHandler(uploadBtn.files[0]);
    }
});

function imageHandler(file) {
    if (!file.type.startsWith("image/")) {
        alert("This file is not an image. What did you think was going to happen?");
        return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        preview.style.backgroundImage = `url('${reader.result}')`;
        preview.style.backgroundSize = "cover";
        localStorage.setItem('globalWallpaper', reader.result);
    }
}

// ping

const pingDot = document.getElementById('ping-dot');
const pingText = document.getElementById('ping-text');
const pingReloadBtn = document.getElementById('ping-reload');

async function pingServer() {
    pingDot.style.background = 'var(--text-megaminimal)';
    pingText.textContent = '...';
    try {
        const start = performance.now();
        await fetch(window.location.origin, { method: 'HEAD', cache: 'no-store' });
        const ms = Math.round(performance.now() - start);
        pingText.textContent = `${ms} ms`;
        if (ms < 100) pingDot.style.background = '#22c55e';
        else if (ms < 300) pingDot.style.background = '#f59e0b';
        else pingDot.style.background = '#ef4444';
    } catch {
        pingText.textContent = 'offline';
        pingDot.style.background = '#ef4444';
    }
}

pingReloadBtn.addEventListener('click', pingServer);
document.addEventListener('DOMContentLoaded', pingServer);

//search bar

document.getElementById('start-search-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        window.parent.postMessage({ type: 'navigate', url: e.target.value }, '*');
        e.target.value = '';
    }
});

//version number
document.querySelector('#hib-version').textContent = `v${window.COMET_VERSION}`;