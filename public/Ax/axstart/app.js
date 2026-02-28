/* javascript for Comet HOME internal page */

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

function updateTime() {
    const time = new Date();

    const timeString = time.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });

    document.getElementById('time').textContent = timeString;
}

updateTime();
setInterval(updateTime, 1000);

async function getCometWeather() {
    try {
        const coords = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = coords.coords;

        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );
        const data = await response.json();

        const temp = Math.round(data.current_weather.temperature);
        document.getElementById('weather-display').textContent = `${temp}°C`;
        
    } catch (error) {
        console.error("Weather failed:", error);
        document.getElementById('weather-display').textContent = "Weather Unavailable";
    }
}

document.addEventListener("DOMContentLoaded", getCometWeather);