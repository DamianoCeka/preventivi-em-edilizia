# Preventivi E.M. Edilizia

Webapp che ho fatto per creare i preventivi di E.M. Edilizia direttamente dal telefono, con la stessa grafica dei PDF che preparavo a mano.

**Link:** https://damianoceka.github.io/preventivi-em-edilizia/

## Cosa fa
- Si sceglie il lavoro da una lista di voci già pronte (rivestimento muretto, lattoneria danneggiata, copertine, sfiati, scossaline, grondaie…): la descrizione si scrive da sola, basta mettere i metri.
- Clienti salvati: si sceglie il cliente e si compilano indirizzo e codice fiscale.
- Note pronte da spuntare (sviluppo lamiera, piattaforma elevatrice, validità, pagamento, preventivo separato).
- Totale a corpo oppure somma automatica degli importi delle voci.
- Crea il PDF sul telefono e lo condivide su WhatsApp o per email.
- Archivio dei preventivi fatti: riaprire, duplicare, rimandare il PDF.
- Funziona anche senza rete e si installa sulla schermata Home.

## Note tecniche
- Nessun server: è tutto statico (HTML, CSS, JS) e i dati restano nel `localStorage` del telefono. Dalle Impostazioni si può fare una copia di sicurezza in JSON.
- PDF generato con [jsPDF](https://github.com/parallax/jsPDF) e font DejaVu Sans (in `vendor/` e `fonts/`).
- Le voci pronte si modificano da Impostazioni → Lavori pronti (`{q}` nel testo = quantità).

## Come installarla sul telefono
- **iPhone (Safari):** apri il link → tasto Condividi → «Aggiungi alla schermata Home».
- **Android (Chrome):** apri il link → menu ⋮ → «Installa app» / «Aggiungi a schermata Home».
