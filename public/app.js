// app switcher
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
//tabs system

let tabs = [];
let activeTabId= null;
let newlyCreatedTabId = null;
const defaultUrl = "Ax/axstart/index.html";
const tabTemplate = document.getElementById('tab');

function createTab(url = defaultUrl) {
    const tabId = Date.now();
    const newTab = {
        id: tabId,
        url: url,
        title: "New Tab"
    };

    if (tabs.length >= 6) return;

    tabs.push(newTab);
    activeTabId = tabId;
    newlyCreatedTabId = tabId;
    renderTabs();
}

document.addEventListener("DOMContentLoaded", () => {
    createTab();
});

document.getElementById('tab-new-btn').addEventListener('click', () => createTab());

function closeTab(id) {
    if (tabs.length <= 1) return;

    const tabEl = document.querySelector(`.tab-div[data-tab-id="${id}"]`);
    if (tabEl) {
        tabEl.classList.add('removing');
        tabEl.addEventListener('animationend', () => {
            const index = tabs.findIndex(t => t.id === id);
            tabs.splice(index, 1);
            if (activeTabId === id) {
                activeTabId = tabs[Math.max(0, index - 1)].id;
            }
            renderTabs();
        }, { once: true });
    } else {
        const index = tabs.findIndex(t => t.id === id);
        tabs.splice(index, 1);
        if (activeTabId === id) {
            activeTabId = tabs[Math.max(0, index - 1)].id;
        }
        renderTabs();
    }
}

function renderTabs() {
    const tabBar = document.getElementById('tab-row');
    const iframeContainer = document.getElementById('iframe-area');
    const newTabBtn = document.getElementById('tab-new-btn');

    tabBar.querySelectorAll('.tab-div').forEach(el => {
        if (!tabs.find(t => t.id == el.dataset.tabId)) el.remove();
    });

    tabs.forEach(tab => {
        let tabEl = tabBar.querySelector(`.tab-div[data-tab-id="${tab.id}"]`);

        if (!tabEl) {
            const clone = tabTemplate.content.cloneNode(true);
            const el = clone.querySelector('.tab-div');
            const nameEl = clone.querySelector('.tab-name');
            const closeBtn = clone.querySelector('.tab-close-btn');

            el.setAttribute('data-tab-id', tab.id);
            nameEl.textContent = tab.title;
            if (tab.id === newlyCreatedTabId) el.classList.add('new');

            el.addEventListener('click', () => {
                activeTabId = tab.id;
                renderTabs();
            });

            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                closeTab(tab.id);
            });

            tabBar.insertBefore(clone, newTabBtn);
            tabEl = tabBar.querySelector(`.tab-div[data-tab-id="${tab.id}"]`);
        }

        tabEl.classList.toggle('active', tab.id === activeTabId);

        let iframe = document.querySelector(`iframe[data-tab-id="${tab.id}"]`);
        if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.src = tab.url;
            iframe.setAttribute('data-tab-id', tab.id);
            iframe.className = 'tab-iframe';
            iframeContainer.appendChild(iframe);
        }
        iframe.style.display = (tab.id === activeTabId) ? 'block' : 'none';
    });

    newlyCreatedTabId = null;
    tabBar.appendChild(newTabBtn);

    document.querySelectorAll('.tab-iframe').forEach(frame => {
        const id = parseInt(frame.getAttribute('data-tab-id'));
        if (!tabs.find(t => t.id === id)) frame.remove();
    });
}

function editTab(id, data) {
    const tab = tabs.find(t => t.id === id);
    if (!tab) throw new Error("No tab currently detected.");

    if (data.title) tab.title = data.title;
    if (data.favicon) tab.favicon = data.favicon;
    if (data.url) {
        tab.url = data.url;
        const iframe = document.querySelector(`iframe[data-tab-id="${id}"]`);
        if (iframe) iframe.src = data.url;
        document.getElementById('url-input').value = data.url.startsWith('/scramjet/') 
            ? scramjet.decodeUrl(data.url) 
            : data.url;
    }

    renderTabs();
}

//sj

const { ScramjetController } = $scramjetLoadController();

const scramjet = new ScramjetController({
    prefix: "/scramjet/",
    files: {
        wasm: "/scramjet.wasm.wasm",
        all: "/scramjet.all.js",
        sync: "/scramjet.sync.js",
    },
});

scramjet.init();

const connection = new BareMux.BareMuxConnection("/baremux-worker.js");
await connection.setTransport("/epoxy.mjs", [{ wisp: "wss://cometpxy.org/wisp/" }]);

navigator.serviceWorker.register("/sw.js");

//url 

document.getElementById('url-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        navigate(e.target.value);
    }
});

//listen for newtab input

window.addEventListener('message', (e) => {
    if (e.data.type === 'navigate') {
        navigate(e.data.url);
    }
});

function navigate(url) {
    if (url.startsWith("comet://")) {
        const path = url.replace("comet://", "Ax/ax") + "/index.html";
        editTab(activeTabId, { url: path });
        return;
    }

    const looksLikeUrl = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/.test(url);

    if (looksLikeUrl) {
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            url = "https://" + url;
        }
    } else {
        url = "https://search.brave.com/search?q=" + encodeURIComponent(url);
    }

    const encoded = scramjet.encodeUrl(url);
    editTab(activeTabId, { url: encoded });
}
