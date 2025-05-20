document.addEventListener('DOMContentLoaded', function() {

    // Selectează DOAR icon-ul hamburger din header
    const hamburgerButton = document.querySelector('header .hamburger-menu');
    // Selectează meniul care trebuie afișat/ascuns
    const targetMenu = document.querySelector('.premium-menu');
    // Selectează body pentru a adăuga clasa de control
    const bodyElement = document.body;

    // Verifică dacă elementele esențiale există
    if (hamburgerButton && targetMenu && bodyElement) {

        hamburgerButton.addEventListener('click', function() {
            // Toggle .active pe BUTON (pentru animația X)
            this.classList.toggle('active');

            // Toggle .menu-open pe BODY (pentru afișare meniu via CSS)
            bodyElement.classList.toggle('menu-open');

            // Accesibilitate (Opțional, dar recomandat)
            const isExpanded = this.classList.contains('active'); // Verifică dacă butonul are clasa active
            this.setAttribute('aria-expanded', isExpanded);
            targetMenu.setAttribute('aria-hidden', !isExpanded);

            // Oprește scroll-ul pe body când meniul e deschis (Opțional)
            if (isExpanded) {
                bodyElement.style.overflow = 'hidden';
            } else {
                bodyElement.style.overflow = ''; // Revine la normal
            }
        });

        // Inițializare atribute ARIA
        hamburgerButton.setAttribute('aria-expanded', 'false');
        targetMenu.setAttribute('aria-hidden', 'true');
        // Dacă targetMenu are un ID, îl poți lega cu aria-controls
        if (targetMenu.id) {
            hamburgerButton.setAttribute('aria-controls', targetMenu.id);
        } else {
            // Poți genera un ID dacă nu există
            // targetMenu.id = 'premium-nav-mobile';
            // hamburgerButton.setAttribute('aria-controls', 'premium-nav-mobile');
        }

    } else {
        // Mesaj de eroare dacă elementele nu sunt găsite (util pt debug)
        if (!hamburgerButton) console.error('Elementul <header .hamburger-menu> nu a fost găsit!');
        if (!targetMenu) console.error('Elementul <.premium-menu> nu a fost găsit!');
    }

    // Adaugă funcționalitate pentru submeniuri în .premium-menu (Opțional)
    const dropdownItems = document.querySelectorAll('.premium-menu .menu-item.dropdown > a');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(event) {
            // Previne navigarea dacă link-ul e '#'
            if (this.getAttribute('href') === '#') {
                event.preventDefault();
            }
            // Găsește submeniul asociat
            const submenu = this.nextElementSibling; // Presupunem că .submenu e imediat după <a>
            if (submenu && submenu.classList.contains('submenu')) {
                // Toggle afișare submeniu
                if (submenu.style.display === 'block') {
                    submenu.style.display = 'none';
                } else {
                    submenu.style.display = 'block';
                }
                // Sau poți adăuga/șterge o clasă 'open' pe li-ul părinte și controla afișarea cu CSS
                // this.parentElement.classList.toggle('open');
            }
        });
    });

});