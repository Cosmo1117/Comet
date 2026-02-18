function encodeUrl(input) { //url encoder
    if (!input) return '';
    if (!/^https?:\/\//i.test(input)) input = 'https://' + input;
    return encodeURIComponent(input.split('').map((ch, i) => 
        (i % 2? String.fromCharCode(ch.charCodeAt(0) ^ 2) : ch)
    ).join(''));
}


async function initProxy() { //prox initializer

    const { ScramjetController } = $scramjetLoadController();
    const scramjet = new ScramjetController({
        files: {
            wasm: "/scram/scramjet.wasm.wasm",
            all: "/scram/scramjet.all.js",
            sync: "/scram/scramjet.sync.js",
        }
    });
    await scramjet.init();


    const connection = new BareMux.BareMuxConnection("/baremux/worker.js");

    await connection.setTransport("/epoxy/index.mjs", [{ wisp: "wss://wisp.mercurywork.shop" }]);

    await navigator.serviceWorker.register("/sw.js", { scope: "/" });
}

async function navigateToUrl() { //ui integration
    const addressBar = document.getElementById('url-input');
    const iframe = document.getElementById('pvp-frame');
    const input = addressBar.value.trim();

    if (!input) return;

    const swstart = await navigator.serviceWorker.ready;

    if (input.startsWith('comet://')) {
        const page = input.split('://')[1];
        iframe.src = `/Ax/ax${page}/index.html`;
    } else {
        iframe.src = '/scram/' + encodeUrl(input);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initProxy();

    const addressBar = document.getElementById('url-input');
    const iframe = document.getElementById('pvp-frame');

    addressBar.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') navigateToUrl();
    });

    document.getElementById('back-btn-nav').onclick = () => iframe.contentWindow.history.back();
    document.getElementById('forward-btn-nav').onclick = () => iframe.contentWindow.history.forward();
    document.getElementById('reload-btn-nav').onclick = () => iframe.contentWindow.location.reload();
});