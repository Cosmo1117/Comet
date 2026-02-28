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