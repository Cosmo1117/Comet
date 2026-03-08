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
const defaultUrl = "ax/axstart/index.html";
const tabTemplate = document.getElementById('tab');

function createTab(url = defaultUrl) {
    const tabId = Date.now();
    const newTab = {
        id: tabId,
        url: url,
        title: "Comet"
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

    tabBar.innerHTML = "";

    tabs.forEach(tab => {
        const clone = tabTemplate.content.cloneNode(true);
        const tabEl = clone.querySelector('.tab-div');
        const nameEl = clone.querySelector('.tab-name');
        const closeBtn = clone.querySelector('.tab-close-btn');

        tabEl.setAttribute('data-tab-id', tab.id);
        if (tab.id === activeTabId) tabEl.classList.add('active');
        if (tab.id === newlyCreatedTabId) tabEl.classList.add('new');
        nameEl.textContent = tab.title;

        tabEl.addEventListener('click', () => {
            activeTabId = tab.id;
            renderTabs();
        });

        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeTab(tab.id);
        });

        tabBar.appendChild(clone);

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