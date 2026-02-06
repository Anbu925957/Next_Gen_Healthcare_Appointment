document.addEventListener('DOMContentLoaded', function () {
    const supportBtn = document.getElementById('supportBtn');
    const supportModal = document.getElementById('supportModal');
    const cancelSupport = document.getElementById('cancelSupport');
    const sendSupport = document.getElementById('sendSupport');
    const supportMessage = document.getElementById('supportMessage');

    if (supportBtn && supportModal) {
        supportBtn.addEventListener('click', function () { supportModal.classList.add('active'); });
    }
    if (cancelSupport) cancelSupport.addEventListener('click', function () { supportModal.classList.remove('active'); });
    if (sendSupport) sendSupport.addEventListener('click', function () {
        const text = supportMessage.value.trim();
        if (!text) { alert('Please write a message'); return; }
        // For demo, save to localStorage
        const msgs = JSON.parse(localStorage.getItem('supportMessages') || '[]');
        msgs.push({ id: Date.now().toString(), message: text, createdAt: new Date().toISOString() });
        localStorage.setItem('supportMessages', JSON.stringify(msgs));
        alert('Support message saved. Our team will reply soon (demo).');
        supportMessage.value = '';
        supportModal.classList.remove('active');
    });
});