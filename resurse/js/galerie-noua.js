// resurse/js/galerie-animata.js
document.addEventListener('DOMContentLoaded', () => {
    const galerieContainer = document.getElementById('galerie-animata');
    const mesajIncarcare = galerieContainer ? galerieContainer.querySelector('.mesaj-incarcare') : null;

    if (!galerieContainer) {
        return; // Scriptul nu rulează dacă nu e pe pagina corectă
    }

    const ANIMATION_TRANSITION_DURATION_MS = 1500;
    const IMAGE_DISPLAY_DURATION_MS = 3000;

    let allImagesData = [];
    let currentImages = [];
    let currentIndex = 0;
    let intervalId = null;
    let isPaused = false;

    function getRandomOddNumber(min, max) {
        let num;
        do {
            num = Math.floor(Math.random() * (max - min + 1)) + min;
        } while (num % 2 === 0);
        return num;
    }

    async function loadGalleryImages() {
        try {
            // Calea către JSON: serverul servește 'resurse' la '/resurse'
            const response = await fetch('/resurse/galerie-statica.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} la ${response.url}`);
            }
            const data = await response.json();

            let basePath = data.cale_galerie; // ex: "imagini/galerii/" sau "/imagini/galerii/"
            // Construiește calea absolută corectă pentru browser
            if (!basePath.startsWith('/')) { // Dacă e relativă, o facem relativă la /resurse/
                basePath = '/resurse/' + basePath;
            } else if (!basePath.startsWith('/resurse/')) { // Dacă e absolută dar nu începe cu /resurse/
                basePath = '/resurse' + basePath;
            }
            // Elimină eventualele dubluri de slash-uri
            basePath = basePath.replace(/\/\//g, '/');
            if (!basePath.endsWith('/')) {
                basePath += '/';
            }


            allImagesData = data.imagini.map(img => {
                let finalSrc = basePath + img.fisier;
                finalSrc = finalSrc.replace(/\/\//g, '/'); // Normalizare finală
                return {
                    src: finalSrc,
                    alt: img.titlu,
                    descriere: img.descriere
                };
            });
            setupGallery();
        } catch (error) {
            console.error("Eroare la încărcarea imaginilor din JSON:", error);
            if (mesajIncarcare) {
                mesajIncarcare.textContent = "Eroare la încărcarea galeriei.";
                mesajIncarcare.style.color = "red";
            }
        }
    }

    function setupGallery() {
        if (mesajIncarcare) mesajIncarcare.style.display = 'none'; // Ascunde mesajul de încărcare

        if (allImagesData.length === 0) {
            galerieContainer.innerHTML = "<p class='mesaj-incarcare' style='color: orange;'>Nu sunt imagini de afișat.</p>";
            return;
        }

        const numImagesToDisplay = getRandomOddNumber(5, Math.min(11, allImagesData.length));
        currentImages = allImagesData.slice(-numImagesToDisplay);

        if (currentImages.length === 0) {
            galerieContainer.innerHTML = "<p class='mesaj-incarcare' style='color: orange;'>Nu s-au putut selecta imagini.</p>";
            return;
        }

        galerieContainer.innerHTML = ''; // Golește galeria

        currentImages.forEach((imgData) => {
            const imgElement = document.createElement('img');
            imgElement.src = imgData.src;
            imgElement.alt = imgData.titlu || "Imagine din galerie";
            imgElement.onerror = () => {
                console.error("Eroare la încărcarea imaginii:", imgData.src);
                // Poți adăuga un placeholder sau un mesaj de eroare specific pentru imaginea respectivă
            };
            galerieContainer.appendChild(imgElement);
        });

        currentIndex = 0;
        if (galerieContainer.children.length > 0) {
            galerieContainer.children[currentIndex].classList.add('active');
        }
        startAnimationLoop();
    }

    function showNextImage() {
        if (currentImages.length === 0 || isPaused || galerieContainer.children.length === 0) return;

        const images = galerieContainer.children;
        const currentImageElement = images[currentIndex];

        currentImageElement.classList.add('animating-out');
        currentImageElement.classList.remove('active');

        currentIndex = (currentIndex + 1) % images.length;
        const nextImageElement = images[currentIndex];

        setTimeout(() => {
            if (isPaused && intervalId) return;
            currentImageElement.classList.remove('animating-out');
            nextImageElement.classList.add('active');
        }, ANIMATION_TRANSITION_DURATION_MS - 50);
    }

    function startAnimationLoop() {
        if (intervalId) clearInterval(intervalId);
        if (currentImages.length <= 1) return;

        if (galerieContainer.children.length > 0 && !galerieContainer.children[currentIndex].classList.contains('active')) {
            galerieContainer.children[currentIndex].classList.add('active');
        }
        intervalId = setInterval(showNextImage, IMAGE_DISPLAY_DURATION_MS + ANIMATION_TRANSITION_DURATION_MS);
    }

    function pauseAnimation() {
        isPaused = true;
        clearInterval(intervalId);
        intervalId = null;
        galerieContainer.classList.add('paused-animation');
    }

    function resumeAnimation() {
        isPaused = false;
        galerieContainer.classList.remove('paused-animation');
        if (currentImages.length > 1) {
            setTimeout(() => {
                if (!isPaused) {
                    showNextImage();
                    startAnimationLoop();
                }
            }, 100);
        }
    }

    galerieContainer.addEventListener('mouseenter', pauseAnimation);
    galerieContainer.addEventListener('mouseleave', resumeAnimation);

    loadGalleryImages();
});