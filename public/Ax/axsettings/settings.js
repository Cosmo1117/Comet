const settingsButtons = document.querySelectorAll('.settings-sb-btn');

settingsButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const targetPage = document.getElementById(targetId);

        if (btn.classList.contains('active')) return;

        document.querySelectorAll('.settings-sb-btn.active').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.settings-page.open').forEach(p => p.classList.remove('open'));

        btn.classList.add('active');
        targetPage.classList.add('open');
    });
});

// settings export / import

document.getElementById('export-settings')?.addEventListener('click', () => {
    const data = JSON.stringify(localStorage, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const a = Object.assign(document.createElement('a'), {
        href: URL.createObjectURL(blob),
        download: 'comet-settings.json',
    });
    a.click();
    URL.revokeObjectURL(a.href);
});

document.getElementById('import-settings-btn')?.addEventListener('click', () => {
    document.getElementById('import-settings-file').click();
});

document.getElementById('import-settings-file')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        try {
            const data = JSON.parse(reader.result);
            Object.entries(data).forEach(([k, v]) => localStorage.setItem(k, v));
        } catch {
            console.error('Invalid settings file');
        }
    };
    reader.readAsText(file);
});

// build stamp

const buildEl = document.getElementById('info-build');
if (buildEl) {
    buildEl.textContent = document.lastModified
        ? new Date(document.lastModified).toLocaleDateString()
        : '—';
}

// re-register service worker

document.getElementById('reregister-sw')?.addEventListener('click', async () => {
    if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(r => r.unregister()));
        location.reload();
    }
});

// data clearing

document.getElementById('clear-cookies')?.addEventListener('click', () => {
    document.cookie.split(';').forEach(c => {
        document.cookie = c.trim().split('=')[0] + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/';
    });
});

document.getElementById('clear-cache')?.addEventListener('click', async () => {
    if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
    }
});

document.getElementById('clear-localstorage')?.addEventListener('click', () => {
    localStorage.clear();
});

document.getElementById('clear-all')?.addEventListener('click', async () => {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(';').forEach(c => {
        document.cookie = c.trim().split('=')[0] + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/';
    });
    if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
    }
});
