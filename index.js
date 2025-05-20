// index.js (versiunea simplificată pentru debug galerie - CORECTATĂ și cu FILTRARE TIMP + TRUNCHIERE)

const express = require('express');
const path = require('path');
const fs = require('fs');

// --- ÎNCĂRCARE DATE GALERIE (la început) ---
let obiectDateGalerie = { cale_galerie: "", imagini: [] };

try {
    const caleFisierJson = path.join(__dirname, 'resurse', 'galerie-statica.json');
    console.log("DEBUG: Încerc să citesc JSON de la calea:", caleFisierJson);
    const continutGalerie = fs.readFileSync(caleFisierJson);
    const jsonParsat = JSON.parse(continutGalerie);

    if (jsonParsat && typeof jsonParsat.cale_galerie === 'string' && Array.isArray(jsonParsat.imagini)) {
        obiectDateGalerie = jsonParsat;
        console.log("DEBUG: Date galerie (brute) încărcate cu succes. Cale galerie:", obiectDateGalerie.cale_galerie, "Număr imagini:", obiectDateGalerie.imagini.length);
    } else {
        console.error("DEBUG: Structura fișierului galerie-statica.json nu este cea așteptată (lipsește cale_galerie sau imagini).");
    }
} catch (err) {
    console.error("DEBUG: EROARE CRITICĂ la încărcarea sau parsarea galerie-statica.json:", err.message);
    if (err.code === 'ENOENT') {
        console.error("   -> Fișierul JSON nu a fost găsit la calea specificată.");
    } else if (err instanceof SyntaxError) {
        console.error("   -> Eroare de sintaxă în fișierul JSON.");
    }
}
// --- SFÂRȘIT ÎNCĂRCARE DATE GALERIE ---

const app = express();
const port = process.env.PORT || 8080;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/resurse', express.static(path.join(__dirname, 'resurse')));
console.log(`DEBUG: Servesc static fișierele din ${path.join(__dirname, 'resurse')} la ruta /resurse`);

app.use((req, res, next) => {
    res.locals.ip_client = req.ip;
    next();
});

app.get(['/', '/index', '/home'], (req, res) => {
    console.log("DEBUG: S-a accesat ruta principală ('/', '/index', sau '/home').");

    // --- LOGICĂ FILTRARE ȘI TRUNCHIERE GALERIE ---
    let imaginiDeAfisat = [];
    if (obiectDateGalerie.imagini && obiectDateGalerie.imagini.length > 0) {
        const dataCurenta = new Date();
        const oraCurenta = dataCurenta.getHours(); // Ora curentă (0-23)
        const minuteCurente = dataCurenta.getMinutes(); // Minutele curente (0-59)
        console.log(`DEBUG: Ora curentă server: ${oraCurenta}:${minuteCurente < 10 ? '0' : ''}${minuteCurente}`);

        imaginiDeAfisat = obiectDateGalerie.imagini.filter(img => {
            if (!img.timp || typeof img.timp !== 'string') {
                // Dacă nu există proprietatea 'timp' sau nu e string, o considerăm "Vizionare liberă"
                // sau o excludem, depinde de cum vrei să tratezi. Aici o includem.
                // Poți adăuga o valoare specială în JSON, ex: "timp": "permanent"
                if (img.timp && (img.timp.toLowerCase() === "vizionare liberă" || img.timp.toLowerCase() === "programare specială")) {
                    return true;
                }
                console.warn(`DEBUG: Imaginea "${img.titlu}" nu are proprietatea 'timp' validă sau lipsește. Va fi inclusă/exclusă conform logicii default.`);
                return false; // Sau true dacă vrei să le incluzi pe cele fără timp specificat
            }

            // Verificăm dacă intervalul este de tipul "HH:MM-HH:MM"
            const intervalRegex = /^(\d{2}):(\d{2})-(\d{2}):(\d{2})$/;
            const match = img.timp.match(intervalRegex);

            if (!match) {
                // Dacă formatul nu e HH:MM-HH:MM, verificăm dacă e una din valorile speciale
                if (img.timp.toLowerCase() === "vizionare liberă" || img.timp.toLowerCase() === "programare specială") {
                    return true;
                }
                console.warn(`DEBUG: Format timp invalid pentru imaginea "${img.titlu}": ${img.timp}. Imaginea va fi exclusă.`);
                return false;
            }

            try {
                const [, startHourStr, startMinuteStr, endHourStr, endMinuteStr] = match;
                const startHour = parseInt(startHourStr, 10);
                const startMinute = parseInt(startMinuteStr, 10);
                const endHour = parseInt(endHourStr, 10);
                const endMinute = parseInt(endMinuteStr, 10);

                // Convertim ora curentă și intervalele în minute de la începutul zilei pentru comparație ușoară
                const currentTimeInMinutes = oraCurenta * 60 + minuteCurente;
                const startTimeInMinutes = startHour * 60 + startMinute;
                let endTimeInMinutes = endHour * 60 + endMinute;

                // Caz special: dacă intervalul trece de miezul nopții (ex: 22:00-02:00)
                // Pentru simplitate, această implementare nu gestionează intervale peste miezul nopții.
                // Dacă endTimeInMinutes este mai mic decât startTimeInMinutes, presupunem că e o eroare în date
                // sau necesită o logică mai complexă. Momentan, o tratăm ca un interval invalid în acest caz.
                if (endTimeInMinutes <= startTimeInMinutes && !(endHour === 0 && endMinute === 0)) { // 00:00 ca end ar putea fi ok
                    console.warn(`DEBUG: Interval timp invalid (end <= start) pentru "${img.titlu}": ${img.timp}. Exclusă.`);
                    return false;
                }
                // Cazul special pentru 00:00 ca final de interval (înseamnă până la sfârșitul zilei)
                if (endHour === 0 && endMinute === 0) {
                    endTimeInMinutes = 24 * 60; // Sfârșitul zilei
                }


                // console.log(`DEBUG: Verific imagine "${img.titlu}" cu interval [${startHour}:${startMinute}-${endHour}:${endMinute}] vs ${oraCurenta}:${minuteCurente}`);
                // console.log(`       Current: ${currentTimeInMinutes}, Start: ${startTimeInMinutes}, End: ${endTimeInMinutes}`);

                return currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes < endTimeInMinutes;

            } catch (e) {
                console.warn(`DEBUG: Eroare la parsarea intervalului de timp pentru imaginea "${img.titlu}": ${img.timp}. Eroare: ${e.message}. Imaginea va fi exclusă.`);
                return false;
            }
        });
        console.log(`DEBUG: Număr imagini după filtrarea temporală: ${imaginiDeAfisat.length}`);

        // Trunchiere la maxim 10 imagini
        if (imaginiDeAfisat.length > 10) {
            imaginiDeAfisat = imaginiDeAfisat.slice(0, 10);
            console.log(`DEBUG: Număr imagini după trunchiere la 10: ${imaginiDeAfisat.length}`);
        }
    } else {
        console.log("DEBUG: Nu există imagini în obiectDateGalerie.imagini pentru a fi filtrate.");
    }
    // --- SFÂRȘIT LOGICĂ FILTRARE ȘI TRUNCHIERE ---


    console.log("DEBUG: Se pregătește randarea 'pagini/index'.");
    const datePentruRender = {
        titlu: 'AutoNet - Acasă (TEST GALERIE)',
        galerie: { // Pasează obiectul cu aceeași structură ca în JSON
            cale_galerie: obiectDateGalerie.cale_galerie,
            imagini: imaginiDeAfisat // Acum pasăm array-ul filtrat și trunchiat
        }
    };

    console.log("DEBUG: Obiectul de date ce va fi pasat la res.render (chei):", JSON.stringify(Object.keys(datePentruRender)));
    if (datePentruRender.galerie) {
        console.log("DEBUG: Structura 'galerie' pasată la render: cale_galerie='", datePentruRender.galerie.cale_galerie, "', imagini.length=", datePentruRender.galerie.imagini ? datePentruRender.galerie.imagini.length : 'undefined');
    } else {
        console.log("DEBUG: 'galerie' NU este definit în datePentruRender!");
    }

    res.render('pagini/index', datePentruRender, (err, html) => {
        if (err) {
            console.error("DEBUG: EROARE la randarea 'pagini/index':", err.message);
            console.error(err.stack);
            res.status(500).send(`Eroare la randarea paginii: ${err.message}`);
            return;
        }
        console.log("DEBUG: Pagina 'pagini/index' randată cu succes.");
        res.send(html);
    });
});

app.use((req, res) => {
    console.warn(`DEBUG: Ruta negăsită (404): ${req.method} ${req.originalUrl}`);
    res.status(404).send(`Pagina nu a fost găsită: ${req.originalUrl}`);
});

app.listen(port, () => {
    console.log(`Serverul AutoNet (DEBUG GALERIE) a pornit.`);
    console.log(`Rulează la adresa: http://localhost:${port}`);
});