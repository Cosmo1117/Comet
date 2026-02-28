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

//clock

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

//weather

async function getCometWeather() {
    try {
        const ipResponse = await fetch('http://ip-api.com/json');
        const location = await ipResponse.json();

        if (location.status !== "success") throw new Error("Failed to grab location")

        const { lat, lon, city } = location;

        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=fahrenheit`
        );
        const weatherData = await weatherResponse.json();

        const temp = Math.round(weatherData.current_weather.temperature);
        document.getElementById('weather').textContent = `${temp}°F`;
        
    } catch (error) {
        console.error("Weather failed:", error);
        document.getElementById('weather').textContent = "Weather Unavailable";
    }
}

document.addEventListener("DOMContentLoaded", getCometWeather);

