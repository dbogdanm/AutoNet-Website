document.addEventListener('DOMContentLoaded', function() {

    const hamburgerButton = document.querySelector('header .hamburger-menu');
    const targetMenu = document.querySelector('.premium-menu');
    const bodyElement = document.body;

    if (hamburgerButton && targetMenu && bodyElement) {

        hamburgerButton.addEventListener('click', function() {
            this.classList.toggle('active');

            // Toggle .menu-open pe BODY (pentru afișare meniu via CSS)
            bodyElement.classList.toggle('menu-open');

            // Accesibilitate (Opțional, dar recomandat)
            const isExpanded = this.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);
            targetMenu.setAttribute('aria-hidden', !isExpanded);

            if (isExpanded) {
                bodyElement.style.overflow = 'hidden';
            } else {
                bodyElement.style.overflow = '';
            }
        });

        hamburgerButton.setAttribute('aria-expanded', 'false');
        targetMenu.setAttribute('aria-hidden', 'true');
        if (targetMenu.id) {
            hamburgerButton.setAttribute('aria-controls', targetMenu.id);
        } else {

        }

    } else {
        if (!hamburgerButton) console.error('Elementul <header .hamburger-menu> nu a fost găsit!');
        if (!targetMenu) console.error('Elementul <.premium-menu> nu a fost găsit!');
    }

    const dropdownItems = document.querySelectorAll('.premium-menu .menu-item.dropdown > a');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(event) {
            // Previne navigarea dacă link-ul e '#'
            if (this.getAttribute('href') === '#') {
                event.preventDefault();
            }

            const submenu = this.nextElementSibling;
            if (submenu && submenu.classList.contains('submenu')) {
                // Toggle afișare submeniu
                if (submenu.style.display === 'block') {
                    submenu.style.display = 'none';
                } else {
                    submenu.style.display = 'block';
                }

            }
        });
    });

});