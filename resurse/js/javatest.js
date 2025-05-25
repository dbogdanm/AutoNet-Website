document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed - Hamburger Check");

    const hamburgerButton = document.querySelector('header .hamburger-menu');
    const bodyElement = document.body;
    const targetMenu = document.querySelector('.premium-menu');

    console.log('Hamburger Button found:', hamburgerButton);
    console.log('Body Element found:', bodyElement);
    console.log('Target Menu found:', targetMenu);

    if (hamburgerButton && bodyElement && targetMenu) {
        console.log('Attaching click listener to hamburger...');
        hamburgerButton.addEventListener('click', function() {
            console.log('Hamburger CLICKED!');

            this.classList.toggle('active');
            bodyElement.classList.toggle('menu-open');

            const isExpanded = this.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);
            targetMenu.setAttribute('aria-hidden', !isExpanded);
            bodyElement.style.overflow = isExpanded ? 'hidden' : '';
        });
        console.log('Click listener attached.');
    } else {
        console.error('ERROR: Could not find one or more elements for hamburger menu!');
        if (!hamburgerButton) console.error('-- Hamburger button missing');
        if (!bodyElement) console.error('-- Body element missing');
        if (!targetMenu) console.error('-- Target menu (.premium-menu) missing');
    }
});



document.addEventListener('DOMContentLoaded', function() {

    const videoTabs = document.querySelectorAll('.video-tab');

    if (videoTabs.length > 0) {
        console.log(`Found ${videoTabs.length} video tabs.`); // Debug

        videoTabs.forEach(tab => {
            tab.addEventListener('click', function(event) {


                console.log(`Tab clicked: ${this.querySelector('.tab-title')?.textContent || 'Unknown'}`); // Debug


                videoTabs.forEach(t => {
                    t.classList.remove('active');
                });

                this.classList.add('active');
            });
        });
    } else {
        console.log("Nu s-au găsit elemente .video-tab.");
    }

});