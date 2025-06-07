function isMobile() {
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

window.addEventListener('DOMContentLoaded', () => {
    const msgEl = document.getElementById('platform-message');
    if (msgEl) {
        msgEl.textContent = isMobile() ? 'Running on mobile device' : 'Running on desktop';
    }
    console.log('Arcade loaded');
});
