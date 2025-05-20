// resurse/js/mobile-panel-menu.js - Actualizat pentru Toggle Separat
document.addEventListener('DOMContentLoaded', () => {
    const hamburgerButton = document.querySelector('header .hamburger-menu');
    const mobileMenuPanel = document.getElementById('mobile-menu-panel');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const bodyElement = document.body;

    // Verificare existență elemente principale
    if (!hamburgerButton || !mobileMenuPanel || !mobileMenuOverlay || !bodyElement) {
        console.error("Elemente esențiale pentru meniul mobil lipsesc!");
        return; // Oprește execuția dacă lipsește ceva
    }

    // Funcția de deschidere/închidere meniu
    const toggleMenu = (event) => {
        if (event) event.stopPropagation(); // Previne propagarea inutilă

        const isActive = bodyElement.classList.toggle('mobile-menu-active'); // Toggle clasa pe body
        hamburgerButton.classList.toggle('active', isActive); // Sincronizează butonul
        bodyElement.style.overflow = isActive ? 'hidden' : '';

        hamburgerButton.setAttribute('aria-expanded', isActive);
        mobileMenuPanel.setAttribute('aria-hidden', !isActive);

        // Închide submeniurile la închiderea panoului principal
        if (!isActive) {
            document.querySelectorAll('#mobile-menu-panel .mobile-menu-dropdown.open').forEach(openDropdown => {
                openDropdown.classList.remove('open');
                const submenu = openDropdown.querySelector('.mobile-submenu');
                if (submenu) { submenu.style.maxHeight = null; submenu.style.padding = '0'; }
            });
        }
    };

    // Atașare listeneri pentru deschidere/închidere
    hamburgerButton.addEventListener('click', toggleMenu);
    mobileMenuOverlay.addEventListener('click', toggleMenu);

    // Inițializare ARIA
    hamburgerButton.setAttribute('aria-expanded', 'false');
    mobileMenuPanel.setAttribute('aria-hidden', 'true');
    if (mobileMenuPanel.id) {
        hamburgerButton.setAttribute('aria-controls', mobileMenuPanel.id);
    }

    // Gestionare dropdown-uri interne (listener pe BUTONUL SĂGEATĂ)
    const dropdownToggles = document.querySelectorAll('#mobile-menu-panel .submenu-toggle-button');
    dropdownToggles.forEach(button => {
        button.addEventListener('click', (e) => {
            const parentLi = button.closest('.mobile-menu-dropdown');
            if (!parentLi) return;
            const submenu = parentLi.querySelector('.mobile-submenu');
            if (!submenu) return;

            // Închide alte dropdown-uri
            document.querySelectorAll('#mobile-menu-panel .mobile-menu-dropdown.open').forEach(openDropdown => {
                if (openDropdown !== parentLi) {
                    openDropdown.classList.remove('open');
                    let otherSubmenu = openDropdown.querySelector('.mobile-submenu');
                    if (otherSubmenu) { otherSubmenu.style.maxHeight = null; otherSubmenu.style.padding = '0'; }
                }
            });

            // Deschide/Închide dropdown-ul curent
            if(parentLi.classList.contains('open')) {
                submenu.style.maxHeight = null;
                submenu.style.padding = '0';
                parentLi.classList.remove('open');
            } else {
                submenu.style.padding = '10px 0'; // Setează paddingul dorit
                submenu.style.maxHeight = submenu.scrollHeight + "px"; // Setează înălțimea DUPĂ padding
                parentLi.classList.add('open');
            }
        });
    });
});