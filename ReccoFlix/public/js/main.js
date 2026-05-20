document.addEventListener("DOMContentLoaded", () => {

    const toggleButton = document.getElementById('menuToggle');
    const navList = document.querySelector('.nav-menu ul');

    if (toggleButton && navList) {
        toggleButton.addEventListener('click', () => {
            navList.classList.toggle('nav-open');
        });
    }

    // Existing functionality for anime-card
    const animeCards = document.querySelectorAll('.anime-card');
    animeCards.forEach(card => {
        card.addEventListener('click', () => {
            const animeElement = card.querySelector('.anime-title');
            const animeName = animeElement ? animeElement.dataset.anime : null;

            if (animeName) {
                fetch('/description', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: animeName })
                })
                    .then(res => res.json())
                    .then(data => {
                        window.location.href = data.redirectUrl;
                    })
                    .catch(error => console.error("Fetch error:", error));
            }
        });
    });


    // NEW — handles franchise + related cards
    document.querySelectorAll('.franchise-card, .related-card').forEach(card => {
        card.addEventListener('click', () => {
            const animeName = card.getAttribute('data-anime');
            if (!animeName) return;

            fetch('/description', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: animeName })
            })
                .then(res => {
                    if (res.redirected) {
                        window.location.href = res.url;
                    } else {
                        window.location.href = `/description?anime=${encodeURIComponent(animeName)}`;
                    }
                })
                .catch(err => console.error("Card fetch error:", err));
        });
    });

});
