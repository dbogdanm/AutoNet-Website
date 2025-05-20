// Asigură-te că acest cod există în javatest.js
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed - Hamburger Check"); // Mesaj 1

    const hamburgerButton = document.querySelector('header .hamburger-menu');
    const bodyElement = document.body;
    const targetMenu = document.querySelector('.premium-menu');

    // Mesaje de debug pentru a vedea dacă elementele sunt găsite
    console.log('Hamburger Button found:', hamburgerButton);  // Mesaj 2
    console.log('Body Element found:', bodyElement);          // Mesaj 3
    console.log('Target Menu found:', targetMenu);          // Mesaj 4

    if (hamburgerButton && bodyElement && targetMenu) {
        console.log('Attaching click listener to hamburger...'); // Mesaj 5
        hamburgerButton.addEventListener('click', function() {
            console.log('Hamburger CLICKED!'); // Mesaj 6 - Ar trebui să apară la click!

            this.classList.toggle('active');
            bodyElement.classList.toggle('menu-open');

            const isExpanded = this.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);
            targetMenu.setAttribute('aria-hidden', !isExpanded);
            bodyElement.style.overflow = isExpanded ? 'hidden' : '';
        });
        console.log('Click listener attached.'); // Mesaj 7
    } else {
        console.error('ERROR: Could not find one or more elements for hamburger menu!'); // Mesaj 8
        if (!hamburgerButton) console.error('-- Hamburger button missing');
        if (!bodyElement) console.error('-- Body element missing');
        if (!targetMenu) console.error('-- Target menu (.premium-menu) missing');
    }
});


// La sfârșitul fișierului tău JS, sau în interiorul DOMContentLoaded dacă ai deja

document.addEventListener('DOMContentLoaded', function() {

    // --- Cod existent (ex: pt hamburger) ---
    // ...

    // --- START: Funcționalitate Tab-uri Video ---
    const videoTabs = document.querySelectorAll('.video-tab'); // Selectăm toate tab-urile

    if (videoTabs.length > 0) { // Verificăm dacă există tab-uri
        console.log(`Found ${videoTabs.length} video tabs.`); // Debug

        videoTabs.forEach(tab => {
            tab.addEventListener('click', function(event) {
                // Nu prevenim default aici, vrem ca linkul să schimbe iframe-ul

                console.log(`Tab clicked: ${this.querySelector('.tab-title')?.textContent || 'Unknown'}`); // Debug

                // 1. Eliminăm clasa .active de la TOATE tab-urile
                videoTabs.forEach(t => {
                    t.classList.remove('active');
                });

                // 2. Adăugăm clasa .active DOAR pe tab-ul curent (pe care s-a dat click)
                this.classList.add('active');
            });
        });
    } else {
        console.log("Nu s-au găsit elemente .video-tab."); // Debug
    }
    // --- END: Funcționalitate Tab-uri Video ---

}); // Sfârșitul DOMContentLoaded (dacă e folosit)