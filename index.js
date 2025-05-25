// index.js (cu SCSS, galerie, și rutele reactivate)

const express = require('express');
const path = require('path');
const fs = require('fs');
const sass = require('sass');

// --- CONFIGURARE INIȚIALĂ ȘI FOLDERE ---
const vect_foldere_globale = ["temp", "backup", "backup/resurse", "backup/resurse/css"];
function creareFoldere(foldereDeCreat) { /* ... (codul tău existent pentru creareFoldere) ... */
    console.log("--- Verificare Foldere Necesare ---");
    foldereDeCreat.forEach(numeFolderRelativ => {
        const caleFolderAbsoluta = path.join(__dirname, numeFolderRelativ);
        const partiCale = numeFolderRelativ.split(path.sep);
        let caleCurenta = __dirname;
        partiCale.forEach(parte => {
            caleCurenta = path.join(caleCurenta, parte);
            if (!fs.existsSync(caleCurenta)) {
                try {
                    fs.mkdirSync(caleCurenta);
                    console.log(`   -> Folderul "${caleCurenta.replace(__dirname, '')}" a fost creat.`);
                } catch (err) {
                    if (err.code !== 'EEXIST') {
                        console.error(`   -> EROARE la crearea folderului "${caleCurenta.replace(__dirname, '')}":`, err);
                    }
                }
            }
        });
        if (fs.existsSync(caleFolderAbsoluta)) {
            console.log(`   -> Folderul "${numeFolderRelativ}" există sau a fost creat.`);
        }
    });
    console.log("--- Verificare Foldere Finalizată ---");
}
creareFoldere(vect_foldere_globale);


const obGlobal = {
    obErori: null, // Va fi setat de initErori
    folderScss: path.join(__dirname, 'resurse', 'scss'),
    folderCss: path.join(__dirname, 'resurse', 'css'),
    folderBackup: path.join(__dirname, 'backup', 'resurse', 'css')
};

// --- FUNCȚIA INIT ERORI (din codul tău original complet) ---
function initErori() {
    try {
        const continutJson = fs.readFileSync(path.join(__dirname, 'erori.json'));
        const eroriJson = JSON.parse(continutJson);
        obGlobal.obErori = {
            cale_baza: eroriJson.cale_baza,
            eroare_default: {
                ...eroriJson.eroare_default,
                imagine: eroriJson.eroare_default.imagine ? path.join('/', eroriJson.cale_baza, eroriJson.eroare_default.imagine).replace(/\\/g, '/') : null
            },
            map_erori: eroriJson.info_erori.reduce((acc, err) => {
                acc[err.identificator] = {
                    ...err,
                    imagine: err.imagine ? path.join('/', eroriJson.cale_baza, err.imagine).replace(/\\/g, '/') : null
                };
                return acc;
            }, {})
        };
    } catch (err) {
        console.error("EROARE CRITICĂ la inițializarea erorilor:", err);
        obGlobal.obErori = {
            cale_baza: '/resurse/imagini/erori/',
            eroare_default: { titlu: "Eroare Server", text: "Datele de eroare nu au putut fi încărcate.", imagine: null },
            map_erori: {}
        };
    }
}
initErori();
// --- SFÂRȘIT INIT ERORI ---

// --- ÎNCĂRCARE DATE GALERIE ---
let obiectDateGalerie = { cale_galerie: "", imagini: [] };
// ... (codul tău existent și funcțional pentru încărcarea galerie-statica.json) ...
try {
    const caleFisierJson = path.join(__dirname, 'resurse', 'galerie-statica.json');
    // console.log("DEBUG GALERIE: Încerc să citesc JSON de la calea:", caleFisierJson); // Poate fi comentat dacă funcționează
    const continutGalerie = fs.readFileSync(caleFisierJson);
    const jsonParsat = JSON.parse(continutGalerie);
    if (jsonParsat && typeof jsonParsat.cale_galerie === 'string' && Array.isArray(jsonParsat.imagini)) {
        obiectDateGalerie = jsonParsat;
        // console.log("DEBUG GALERIE: Date galerie încărcate. Cale:", obiectDateGalerie.cale_galerie, "Nr. imagini:", obiectDateGalerie.imagini.length);
    } else {
        console.error("DEBUG GALERIE: Structura galerie-statica.json invalidă.");
    }
} catch (err) {
    console.error("DEBUG GALERIE: EROARE la încărcare/parsare galerie-statica.json:", err.message);
}
// --- SFÂRȘIT ÎNCĂRCARE DATE GALERIE ---


// --- FUNCȚII PENTRU COMPILARE SCSS ---
let compileTimeout = null;
function backupCssExistent(caleCssActual) {
    if (fs.existsSync(caleCssActual)) {
        const numeFisierCss = path.basename(caleCssActual);
        const caleBackup = path.join(obGlobal.folderBackup, numeFisierCss);
        try {
            // Asigură existența folderului de backup specific
            if (!fs.existsSync(path.dirname(caleBackup))) {
                fs.mkdirSync(path.dirname(caleBackup), { recursive: true });
                console.log(`SCSS: Folderul backup specific creat: ${path.dirname(caleBackup).replace(__dirname, '')}`);
            }
            fs.copyFileSync(caleCssActual, caleBackup);
            console.log(`SCSS: Backup creat pentru ${numeFisierCss} -> ${caleBackup.replace(__dirname, '')}`);
        } catch (err) {
            console.error(`SCSS: EROARE la crearea backup-ului pentru ${caleCssActual}:`, err);
        }
    } else {
        // console.log(`SCSS: Nu există fișier CSS anterior la ${caleCssActual} pentru backup.`);
    }
}

function compileazaScss(caleScssRelativaSauAbsoluta, caleCssRelativaSauAbsolutaParam = null) {
    console.log(`SCSS: Se încearcă compilarea: ${caleScssRelativaSauAbsoluta}`);
    let caleSursaAbsoluta, caleDestinatieAbsoluta;

    // Determinăm calea absolută pentru sursa SCSS
    if (path.isAbsolute(caleScssRelativaSauAbsoluta)) {
        caleSursaAbsoluta = caleScssRelativaSauAbsoluta;
    } else {
        caleSursaAbsoluta = path.join(obGlobal.folderScss, caleScssRelativaSauAbsoluta);
    }

    // Determinăm calea absolută pentru destinația CSS
    if (caleCssRelativaSauAbsolutaParam) {
        if (path.isAbsolute(caleCssRelativaSauAbsolutaParam)) {
            caleDestinatieAbsoluta = caleCssRelativaSauAbsolutaParam;
        } else {
            caleDestinatieAbsoluta = path.join(obGlobal.folderCss, caleCssRelativaSauAbsolutaParam);
        }
    } else {
        // Dacă caleCssRelativaSauAbsolutaParam lipsește, generăm numele din calea SCSS
        // (presupunând că calea SCSS este relativă la obGlobal.folderScss sau absolută)
        let numeFisierDeBaza;
        if (path.isAbsolute(caleScssRelativaSauAbsoluta)) {
            numeFisierDeBaza = path.basename(caleScssRelativaSauAbsoluta, '.scss');
        } else { // este relativă la obGlobal.folderScss
            numeFisierDeBaza = path.basename(caleScssRelativaSauAbsoluta, '.scss');
        }
        caleDestinatieAbsoluta = path.join(obGlobal.folderCss, `${numeFisierDeBaza}.css`);
    }

    if (!fs.existsSync(caleSursaAbsoluta)) {
        console.error(`SCSS: Fișierul sursă SCSS nu a fost găsit: ${caleSursaAbsoluta}`);
        return false;
    }

    const folderDestinatieCss = path.dirname(caleDestinatieAbsoluta);
    if (!fs.existsSync(folderDestinatieCss)) {
        try {
            fs.mkdirSync(folderDestinatieCss, { recursive: true });
            console.log(`SCSS: Folderul destinație CSS creat: ${folderDestinatieCss.replace(__dirname, '')}`);
        } catch (err) {
            console.error(`SCSS: EROARE la crearea folderului destinație CSS "${folderDestinatieCss}":`, err);
            return false;
        }
    }

    try {
        backupCssExistent(caleDestinatieAbsoluta);
        const rezultat = sass.compile(caleSursaAbsoluta, {
            style: "expanded", // Sau "compressed" pentru producție
            loadPaths: [path.join(__dirname, 'node_modules')] // Adaugă node_modules la căile de căutare SASS
        });
        fs.writeFileSync(caleDestinatieAbsoluta, rezultat.css);
        console.log(`SCSS: Compilat: ${caleSursaAbsoluta.replace(__dirname, '')} -> ${caleDestinatieAbsoluta.replace(__dirname, '')}`);
        return true;
    } catch (err) {
        console.error(`SCSS: EROARE la compilarea ${caleSursaAbsoluta.replace(__dirname, '')}:`);
        if (err.formatted) { // sass poate oferi o eroare formatată
            console.error(err.formatted);
        } else {
            console.error(err.message);
        }
        return false;
    }
}

function compilareInitialaScss() {
    console.log("SCSS: --- Început compilare inițială SCSS ---");
    if (!obGlobal.folderScss || !fs.existsSync(obGlobal.folderScss)) {
        console.warn(`SCSS: Folderul SCSS (${obGlobal.folderScss ? obGlobal.folderScss.replace(__dirname, '') : 'NEDEFINIT'}) nu există. Compilarea inițială este omisă.`);
        return;
    }
    try {
        const fisiereScss = fs.readdirSync(obGlobal.folderScss);
        let compilariReusite = 0; let compilariEsuate = 0;

        fisiereScss.forEach(fisier => {
            // Compilează doar fișierele .scss care nu încep cu _ (partials)
            if (path.extname(fisier).toLowerCase() === '.scss' && !fisier.startsWith('_')) {
                // Pasează numele fișierului (cale relativă la folderScss)
                if (compileazaScss(fisier)) {
                    compilariReusite++;
                } else {
                    compilariEsuate++;
                }
            }
        });
        console.log(`SCSS: --- Compilare inițială SCSS finalizată. Reușite: ${compilariReusite}, Eșuate: ${compilariEsuate} ---`);
    } catch (err) {
        console.error("SCSS: EROARE la citirea folderului SCSS pentru compilarea inițială:", err);
    }
}

function pornesteWatchScss() {
    if (!obGlobal.folderScss || !fs.existsSync(obGlobal.folderScss)) {
        console.warn(`SCSS: Folderul SCSS (${obGlobal.folderScss ? obGlobal.folderScss.replace(__dirname, '') : 'NEDEFINIT'}) nu există. Urmărirea (watch) nu poate fi pornită.`);
        return;
    }
    console.log(`SCSS: Se pornește urmărirea modificărilor în: ${obGlobal.folderScss.replace(__dirname, '')}`);

    fs.watch(obGlobal.folderScss, { recursive: true }, (eventType, filename) => {
        if (filename && path.extname(filename).toLowerCase() === '.scss' && !path.basename(filename).startsWith('_')) {
            // filename de la fs.watch poate fi doar numele fișierului sau o cale relativă DINAUNTRUL folderScss
            // De ex., dacă modifici 'subfolder/stil.scss', filename poate fi 'subfolder/stil.scss' sau doar 'stil.scss'
            // Funcția compileazaScss se așteaptă la o cale relativă din obGlobal.folderScss
            // Deci, dacă filename este deja 'subfolder/stil.scss', e ok.
            // Dacă este doar 'stil.scss' și e într-un subfolder, path.join(obGlobal.folderScss, filename) va fi greșit.
            // Pentru robustețe, ar trebui să reconstruim calea relativă corectă dacă e cazul,
            // dar pentru fișiere direct în obGlobal.folderScss, 'filename' ar trebui să fie suficient.

            const caleSursaScssCompleta = path.join(obGlobal.folderScss, filename);

            if (!fs.existsSync(caleSursaScssCompleta)) {
                console.log(`SCSS WATCH: Fișierul ${filename} (cale completă: ${caleSursaScssCompleta}) nu mai există, compilare omisă.`);
                return;
            }

            console.log(`SCSS WATCH: Eveniment '${eventType}' detectat pentru: ${filename}`);
            clearTimeout(compileTimeout);
            compileTimeout = setTimeout(() => {
                console.log(`SCSS WATCH: Se recompilează ${filename}...`);
                compileazaScss(filename); // filename este calea relativă din folderScss
            }, 300); // Debounce
        }
    });
}

// --- APELURI INIȚIALE PENTRU SCSS ---
compilareInitialaScss();
if (process.env.NODE_ENV !== 'production') { // Rulează watch doar în dezvoltare
    pornesteWatchScss();
}
// --- SFÂRȘIT FUNCȚII SCSS ---

// ... (restul codului tău: const app = express(); etc.)
// --- SFÂRȘIT FUNCȚII SCSS ---

const app = express();
const port = process.env.PORT || 8080;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- MIDDLEWARE-URI ---
app.use((req, res, next) => {
    res.locals.ip_client = req.ip;
    next();
});

app.use('/resurse/css', express.static(obGlobal.folderCss)); // Specific pentru CSS compilate
app.use('/resurse', express.static(path.join(__dirname, 'resurse'))); // General pentru alte resurse

// Protecție directoare și fișiere EJS (din codul tău original)
app.get(/^\/resurse\/.*\/$/, (req, res, next) => {
    const caleResursa = path.join(__dirname, req.path);
    fs.stat(caleResursa, (err, stats) => {
        if (!err && stats.isDirectory()) {
            console.warn(`Acces interzis la directorul: ${req.path}`);
            afisareEroare(res, 403);
        } else { next(); }
    });
});
app.get(/.*\.ejs$/i, (req, res) => {
    console.warn(`Acces interzis la fișier EJS: ${req.originalUrl}`);
    afisareEroare(res, 400, "Cerere Invalidă", "Accesul direct la fișierele template nu este permis.");
});
// --- SFÂRȘIT MIDDLEWARE-URI ---


// --- FUNCȚIA AFIȘARE EROARE (din codul tău original complet) ---
function afisareEroare(res, identificator, titluParam = null, textParam = null, imagineParam = null) {
    if (!obGlobal.obErori) {
        console.error("FATAL: obGlobal.obErori nu este inițializat!");
        return res.status(500).send("Eroare critică server.");
    }
    const eroareGasita = obGlobal.obErori.map_erori[identificator];
    const eroareDefault = obGlobal.obErori.eroare_default;
    const dateFinale = {
        titlu: titluParam || (eroareGasita ? eroareGasita.titlu : eroareDefault.titlu),
        text: textParam || (eroareGasita ? eroareGasita.text : eroareDefault.text),
        imagine: imagineParam
            ? path.join('/', obGlobal.obErori.cale_baza || '/', imagineParam).replace(/\\/g, '/')
            : (eroareGasita ? eroareGasita.imagine : eroareDefault.imagine)
    };
    const statusCode = (eroareGasita && eroareGasita.status) || [404, 403, 400, 500].includes(identificator)
        ? identificator
        : (eroareDefault.status ? 500 : 500);

    console.error(`Randare eroare: ID:[${identificator || 'default'}], Status:[${statusCode}], Titlu:[${dateFinale.titlu}]`);
    res.status(statusCode);
    res.render('pagini/eroare', {
        titlu: dateFinale.titlu,
        eroare: dateFinale
    });
}
// --- SFÂRȘIT FUNCȚIA AFIȘARE EROARE ---


// --- RUTE SPECIFICE ---
app.get('/favicon.ico', (req, res) => {
    const caleFavicon = path.join(__dirname, 'resurse', 'imagini', 'favicon', 'favicon.ico');
    res.sendFile(caleFavicon, (err) => {
        if (err) { /* console.error("Eroare favicon:", err.message); */ res.status(404).send("Favicon not found."); }
    });
});

app.get(['/', '/index', '/home'], (req, res) => {
    // ... (logica ta de filtrare și trunchiere pentru imaginiDeAfisat) ...
    let imaginiDeAfisat = [];
    if (obiectDateGalerie.imagini && obiectDateGalerie.imagini.length > 0) {
        const dataCurenta = new Date();
        const oraCurenta = dataCurenta.getHours();
        const minuteCurente = dataCurenta.getMinutes();
        // console.log(`DEBUG GALERIE: Ora curentă server: ${oraCurenta}:${minuteCurente < 10 ? '0' : ''}${minuteCurente}`);
        imaginiDeAfisat = obiectDateGalerie.imagini.filter(img => {
            if (!img.timp || typeof img.timp !== 'string') {
                if (img.timp && (img.timp.toLowerCase() === "vizionare liberă" || img.timp.toLowerCase() === "programare specială")) return true;
                return false;
            }
            const intervalRegex = /^(\d{2}):(\d{2})-(\d{2}):(\d{2})$/;
            const match = img.timp.match(intervalRegex);
            if (!match) {
                if (img.timp.toLowerCase() === "vizionare liberă" || img.timp.toLowerCase() === "programare specială") return true;
                return false;
            }
            try {
                const [, startHourStr, startMinuteStr, endHourStr, endMinuteStr] = match;
                const startHour = parseInt(startHourStr, 10), startMinute = parseInt(startMinuteStr, 10);
                const endHour = parseInt(endHourStr, 10), endMinute = parseInt(endMinuteStr, 10);
                const currentTimeInMinutes = oraCurenta * 60 + minuteCurente;
                const startTimeInMinutes = startHour * 60 + startMinute;
                let endTimeInMinutes = endHour * 60 + endMinute;
                if (endTimeInMinutes <= startTimeInMinutes && !(endHour === 0 && endMinute === 0)) return false;
                if (endHour === 0 && endMinute === 0) endTimeInMinutes = 24 * 60;
                return currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes < endTimeInMinutes;
            } catch (e) { return false; }
        });
        // console.log(`DEBUG GALERIE: Nr. imagini după filtrare timp: ${imaginiDeAfisat.length}`);
        if (imaginiDeAfisat.length > 10) {
            imaginiDeAfisat = imaginiDeAfisat.slice(0, 10);
            // console.log(`DEBUG GALERIE: Nr. imagini după trunchiere: ${imaginiDeAfisat.length}`);
        }
    }

    res.render('pagini/index', {
        titlu: 'AutoNet - Acasă',
        galerie: {
            cale_galerie: obiectDateGalerie.cale_galerie,
            imagini: imaginiDeAfisat
        }
    }, (err, html) => {
        if (err) { console.error("Eroare la randarea paginii index:", err); afisareEroare(res, 500); return; }
        res.send(html);
    });
});

app.get('/despre', (req, res) => {
    res.render('pagini/despre', { titlu: 'AutoNet - Despre Noi' }, (err, html) => {
        if (err) { console.error("Eroare la randarea paginii /despre:", err); afisareEroare(res, 500); return; }
        res.send(html);
    });
});

app.get('/video-upload', (req, res) => {
    res.render('pagini/video-upload', { titlu: 'AutoNet - Video & Upload' }, (err, html) => {
        if (err) { console.error("Eroare la randarea paginii /video-upload:", err); afisareEroare(res, 500); return; }
        res.send(html);
    });
});

app.get('/efecte', (req, res) => { // Ruta pentru pagina de efecte
    res.render('pagini/efecte', { titlu: 'AutoNet - Efecte CSS' }, (err, html) => {
        if (err) { console.error("Eroare la randarea paginii /efecte:", err); afisareEroare(res, 500); return; }
        res.send(html);
    });
});
// În index.js (versiunea cu SCSS și celelalte rute)

// ... (după ruta /efecte) ...

// În index.js
app.get('/galerie-noua', (req, res) => {
    console.log("DEBUG: Ruta /galerie-noua accesată.");
    res.render('pagini/galerie-noua', {
        titlu: 'AutoNet - Noua Galerie Animație',
        galerie: obiectDateGalerie // Presupunând că obiectDateGalerie este încărcat corect
    });
});


// --- RUTA GENERICĂ PENTRU ALTE PAGINI EJS (trebuie să fie după cele specifice) ---
app.get('/:pagina', (req, res, next) => {
    const numePagina = req.params.pagina;
    // Verificăm să nu fie un folder pe care îl servim static deja
    if (['resurse', 'css', 'scss', 'imagini', 'js', 'video', 'views', 'node_modules', 'backup', 'temp'].includes(numePagina.toLowerCase())) {
        return next();
    }
    const caleFisierEJS = path.join(__dirname, 'views', 'pagini', `${numePagina}.ejs`);
    fs.access(caleFisierEJS, fs.constants.F_OK, (err) => {
        if (err) {
            // console.log(`Fișierul EJS pentru /${numePagina} nu a fost găsit, se trece la 404.`);
            next(); // Pasează la handler-ul 404
        } else {
            res.render(`pagini/${numePagina}`, {
                titlu: `AutoNet - ${numePagina.charAt(0).toUpperCase() + numePagina.slice(1)}`
                // Poți adăuga și 'galerie: obiectDateGalerie' aici dacă vrei galeria pe toate paginile
            }, (renderErr, html) => {
                if (renderErr) {
                    console.error(`Eroare randare /${numePagina}:`, renderErr);
                    afisareEroare(res, renderErr.message.startsWith("Failed to lookup view") ? 404 : 500);
                    return;
                }
                res.send(html);
            });
        }
    });
});
// --- SFÂRȘIT RUTA GENERICĂ ---


// --- HANDLER PENTRU RUTE NEGĂSITE (404) - ULTIMUL ---
app.use((req, res) => {
    console.warn(`Ruta negăsită (404): ${req.method} ${req.originalUrl}`);
    afisareEroare(res, 404);
});

// --- PORNIRE SERVER ---
app.listen(port, () => {
    console.log(`Serverul AutoNet a pornit.`);
    console.log(`Rulează la adresa: http://localhost:${port}`);
});