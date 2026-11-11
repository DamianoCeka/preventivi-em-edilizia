/* Preventivi E.M. Edilizia — tutto salvato sul telefono (localStorage), PDF generato in locale. */
(function () {
  "use strict";

  // ---------- Dati predefiniti ----------
  const IMPOSTAZIONI_BASE = {
    ditta: "E.M. EDILIZIA",
    sottotitolo: "Coperture  ·  Isolamenti  ·  Lattonerie",
    referente: "Gallushi Rexhep",
    indirizzo: "", piva: "", telefono: "", email: "",
    prossimoNumero: 1,
  };

  // {q} viene sostituito con la quantità inserita
  // [categoria, titolo, unità, testo] — {q} = quantità
  const CATALOGO_BASE = [
    ["Lattonerie", "Rivestimento del muretto", "m", "Completamento del rivestimento in lattoneria nelle parti mancanti del muretto, per una lunghezza complessiva di circa {q} metri lineari."],
    ["Lattonerie", "Sostituzione lattoneria danneggiata", "m", "Rimozione della lattoneria danneggiata e fornitura e posa in opera della nuova lattoneria, per una lunghezza complessiva di circa {q} metri lineari."],
    ["Lattonerie", "Lattoneria in alluminio", "m", "Fornitura e posa in opera di lattoneria in alluminio, colore antracite, comprensiva di sigillatura, per circa {q} metri lineari."],
    ["Lattonerie", "Copertina in alluminio", "corpo", "Fornitura e posa in opera di copertina in alluminio, colore bianco/grigio, con fissaggio meccanico."],
    ["Lattonerie", "Scossaline dei lucernari", "corpo", "Realizzazione e posa di scossaline in lattoneria attorno ai lucernari interessati da infiltrazioni d’acqua, a protezione dei raccordi con la copertura."],
    ["Lattonerie", "Rimozione e riposa delle scossaline", "corpo", "Rimozione delle scossaline esistenti e loro riposizionamento a copertura ultimata."],
    ["Lattonerie", "Nuove scossaline", "m", "Fornitura e posa in opera di nuove scossaline in lamiera, complete di fissaggi e sigillatura, per circa {q} metri lineari."],
    ["Lattonerie", "Converse e raccordi a muro", "m", "Fornitura e posa in opera di converse e raccordi a muro in lamiera, completi di sigillatura, per circa {q} metri lineari."],
    ["Lattonerie", "Rivestimento del camino", "pz", "Rivestimento in lattoneria del camino, completo di raccordo con la copertura e sigillatura."],
    ["Lattonerie", "Sostituzione grondaia", "m", "Rimozione della grondaia esistente e fornitura e posa in opera della nuova grondaia, completa di staffe e accessori, per circa {q} metri lineari."],
    ["Lattonerie", "Nuova grondaia", "m", "Fornitura e posa in opera di grondaia in lamiera, completa di staffe, testate e accessori, per circa {q} metri lineari."],
    ["Lattonerie", "Pluviali", "m", "Fornitura e posa in opera di pluviali in lamiera, completi di collari e raccordi, per circa {q} metri lineari."],
    ["Lattonerie", "Pulizia grondaie e pluviali", "corpo", "Pulizia di grondaie e pluviali con rimozione di foglie e detriti e verifica del corretto deflusso dell’acqua."],
    ["Lattonerie", "Paraneve", "m", "Fornitura e posa in opera di paraneve sulla copertura, per circa {q} metri lineari."],

    ["Guaine e impermeabilizzazioni", "Applicazione primer", "mq", "Applicazione di primer per l’aggrappaggio della nuova impermeabilizzazione, su una superficie di circa {q} m²."],
    ["Guaine e impermeabilizzazioni", "Rimozione guaina danneggiata e scarichi", "corpo", "Rimozione degli scarichi esistenti e della guaina danneggiata o ritirata, solo dove necessario."],
    ["Guaine e impermeabilizzazioni", "Rimozione completa della vecchia guaina", "mq", "Rimozione completa della guaina esistente, compresi carico, trasporto e smaltimento, per circa {q} m²."],
    ["Guaine e impermeabilizzazioni", "Nuova guaina 4 mm saldata a fiamma", "mq", "Fornitura e posa in opera di nuova guaina liscia da 4 mm, flessibilità a freddo −20 °C, saldata a fiamma e certificata, su una superficie di circa {q} m²."],
    ["Guaine e impermeabilizzazioni", "Guaina ardesiata", "mq", "Fornitura e posa in opera di guaina ardesiata saldata a fiamma come strato di finitura, su una superficie di circa {q} m²."],
    ["Guaine e impermeabilizzazioni", "Doppio strato di guaina (solo manodopera)", "mq", "Posa in opera di due strati di guaina saldata a fiamma, compresa l’applicazione del primer, su una superficie di circa {q} m². Solo manodopera."],
    ["Guaine e impermeabilizzazioni", "Doppio strato di guaina (fornitura e posa)", "mq", "Fornitura e posa in opera di doppio strato di guaina saldata a fiamma, con sormonti sfalsati e risvolti perimetrali, su una superficie di circa {q} m²."],
    ["Guaine e impermeabilizzazioni", "Riparazione localizzata della guaina", "corpo", "Riparazione localizzata della guaina nei punti danneggiati, con rappezzi saldati a fiamma e sigillatura."],
    ["Guaine e impermeabilizzazioni", "Sostituzione scarichi", "corpo", "Sostituzione degli scarichi della copertura con nuovi elementi."],
    ["Guaine e impermeabilizzazioni", "Nuovo scarico da 100 mm", "pz", "Realizzazione del foro e fornitura e posa in opera di nuovo scarico da 100 mm, completo di pluviale."],
    ["Guaine e impermeabilizzazioni", "Sfiati mancanti", "corpo", "Fornitura e posa in opera degli sfiati mancanti in copertura, comprensiva di posizionamento e fissaggio."],
    ["Guaine e impermeabilizzazioni", "Due mani di vernice all’alluminio", "corpo", "Applicazione di due mani di vernice protettiva all’alluminio sulla nuova guaina, da eseguire entro due mesi dalla posa."],
    ["Guaine e impermeabilizzazioni", "Impermeabilizzazione di balcone o terrazza", "mq", "Impermeabilizzazione del balcone o della terrazza, compresi risvolti e raccordi con gli scarichi, per circa {q} m²."],

    ["Tetti e coperture", "Rimozione del manto di copertura", "mq", "Rimozione del manto di copertura esistente, compresi calo a terra, carico e smaltimento, per circa {q} m²."],
    ["Tetti e coperture", "Ripasso del manto in tegole o coppi", "mq", "Ripasso del manto di copertura con sostituzione degli elementi rotti e sistemazione di quelli spostati, per circa {q} m²."],
    ["Tetti e coperture", "Nuovo manto in tegole o coppi", "mq", "Fornitura e posa in opera di nuovo manto di copertura in tegole o coppi, compresi pezzi speciali, per circa {q} m²."],
    ["Tetti e coperture", "Pannelli di copertura", "mq", "Fornitura e posa in opera di pannelli di copertura, compresi fissaggi e accessori, per circa {q} m²."],
    ["Tetti e coperture", "Lamiera grecata", "mq", "Fornitura e posa in opera di copertura in lamiera grecata, compresi fissaggi e accessori, per circa {q} m²."],
    ["Tetti e coperture", "Listellatura", "mq", "Fornitura e posa in opera di listelli in legno per la ventilazione e il fissaggio del manto, per circa {q} m²."],
    ["Tetti e coperture", "Telo traspirante sottotegola", "mq", "Fornitura e posa in opera di telo traspirante sottotegola, con sormonti nastrati, per circa {q} m²."],
    ["Tetti e coperture", "Sistemazione del colmo", "m", "Sistemazione del colmo con fissaggio degli elementi e ripristino della tenuta, per circa {q} metri lineari."],
    ["Tetti e coperture", "Sostituzione lucernario", "pz", "Rimozione del lucernario esistente e fornitura e posa in opera del nuovo, completo di raccordi e scossaline."],
    ["Tetti e coperture", "Ricerca e riparazione infiltrazione", "corpo", "Ricerca del punto di infiltrazione e riparazione con ripristino della tenuta all’acqua."],
    ["Tetti e coperture", "Isolamento della copertura", "mq", "Fornitura e posa in opera di pannelli isolanti in copertura, per una superficie di circa {q} m²."],
    ["Tetti e coperture", "Barriera al vapore", "mq", "Fornitura e posa in opera di barriera al vapore sotto lo strato isolante, per circa {q} m²."],

    ["Terrazze e opere edili", "Demolizione del massetto", "mq", "Demolizione del massetto esistente, compresi carico, trasporto e smaltimento delle macerie, per circa {q} m²."],
    ["Terrazze e opere edili", "Massetto delle pendenze", "mq", "Realizzazione di nuovo massetto con le pendenze necessarie al deflusso dell’acqua, per circa {q} m²."],
    ["Terrazze e opere edili", "Pavimento in gres per esterni", "mq", "Fornitura e posa in opera di pavimento in gres porcellanato per esterni, colore a scelta del cliente, per circa {q} m²."],
    ["Terrazze e opere edili", "Demolizione di pavimento e rivestimenti", "mq", "Demolizione di pavimento e rivestimenti esistenti, compresi carico, trasporto e smaltimento delle macerie, per circa {q} m²."],
    ["Terrazze e opere edili", "Posa di pavimento", "mq", "Posa in opera di pavimento, compresi colla e stuccatura delle fughe, per circa {q} m²."],
    ["Terrazze e opere edili", "Intonaco", "mq", "Realizzazione di intonaco su pareti o soffitti, finito a regola d’arte, per circa {q} m²."],
    ["Terrazze e opere edili", "Ripristino sottobalcone", "corpo", "Ripristino del sottobalcone con rimozione delle parti ammalorate, rasatura e tinteggiatura."],
    ["Terrazze e opere edili", "Idropulitura", "mq", "Lavaggio delle superfici con idropulitrice, per circa {q} m²."],
    ["Terrazze e opere edili", "Riparazione di crepe e fori", "corpo", "Riparazione di crepe e fori dove necessario, con stuccatura e rasatura."],
    ["Terrazze e opere edili", "Tinteggiatura", "mq", "Applicazione di fissativo e di due mani di pittura, per circa {q} m²."],
    ["Terrazze e opere edili", "Smontaggio e rimontaggio ringhiera", "corpo", "Smontaggio della ringhiera esistente e suo rimontaggio a lavori ultimati."],
    ["Terrazze e opere edili", "Sollevamento travi in legno", "corpo", "Sollevamento e messa in sicurezza delle travi in legno mediante cric."],

    ["Cantiere", "Montaggio e smontaggio castello", "corpo", "Montaggio e smontaggio del castello di salita per l’accesso in sicurezza alla copertura."],
    ["Cantiere", "Montaggio e smontaggio ponteggio", "corpo", "Montaggio e smontaggio del ponteggio a norma, per tutta la durata dei lavori."],
    ["Cantiere", "Noleggio piattaforma elevatrice", "corpo", "Noleggio di piattaforma elevatrice per l’esecuzione dei lavori in quota."],
    ["Cantiere", "Smaltimento materiali di risulta", "corpo", "Carico, trasporto e smaltimento in discarica autorizzata dei materiali di risulta."],
    ["Cantiere", "Pulizia finale del cantiere", "corpo", "Pulizia finale dell’area di lavoro a lavori ultimati."],
  ].map(([cat, titolo, tipo, testo]) => ({ cat, titolo, tipo, testo }));
  const CATEGORIE = [...new Set(CATALOGO_BASE.map((c) => c.cat)), "Altro"];

  // Lavori tipo: aggiungono in un colpo oggetto e voci
  const MODELLI = [
    { nome: "Rifacimento copertura con guaina", oggetto: "Rifacimento dell’impermeabilizzazione della copertura.",
      opz: { sviluppo: false, piattaforma: false },
      voci: ["Montaggio e smontaggio castello", "Applicazione primer", "Rimozione guaina danneggiata e scarichi",
             "Rimozione e riposa delle scossaline", "Nuova guaina 4 mm saldata a fiamma", "Sostituzione scarichi",
             "Due mani di vernice all’alluminio"] },
    { nome: "Doppia guaina, solo manodopera", oggetto: "Posa in opera di doppio strato di guaina saldata a fiamma.",
      opz: { sviluppo: false, piattaforma: false },
      voci: ["Doppio strato di guaina (solo manodopera)"] },
    { nome: "Lattonerie in copertura", oggetto: "Lavori di completamento e sistemazione delle lattonerie in copertura.",
      opz: { sviluppo: true, piattaforma: true },
      voci: ["Rivestimento del muretto", "Copertina in alluminio", "Sfiati mancanti", "Scossaline dei lucernari"] },
    { nome: "Sostituzione lattoneria danneggiata", oggetto: "Sostituzione della lattoneria danneggiata.",
      opz: { sviluppo: true, piattaforma: true },
      voci: ["Sostituzione lattoneria danneggiata"] },
    { nome: "Sistemazione terrazza con infiltrazioni", oggetto: "Lavori di ripristino e impermeabilizzazione della terrazza.",
      opz: { sviluppo: false, piattaforma: false },
      voci: ["Noleggio piattaforma elevatrice", "Demolizione del massetto", "Applicazione primer", "Nuovo scarico da 100 mm",
             "Nuova guaina 4 mm saldata a fiamma", "Massetto delle pendenze", "Pavimento in gres per esterni"] },
  ];

  const CLIENTI_BASE = [];

  const OGGETTI = [
    "Lavori di completamento e sistemazione delle lattonerie in copertura.",
    "Sostituzione della lattoneria danneggiata.",
    "Rifacimento dell’impermeabilizzazione della copertura.",
    "Lavori di ripristino e impermeabilizzazione della terrazza.",
  ];

  // ---------- Archivio locale ----------
  const load = (k, def) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? def; } catch { return def; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  let impostazioni = Object.assign({}, IMPOSTAZIONI_BASE, load("imp", {}));
  let catalogo = load("catalogo", null) || CATALOGO_BASE.map((c) => ({ id: uid(), ...c }));
  if (load("catv", 0) < 3) {
    // aggiorno le voci pronte senza toccare quelle aggiunte o modificate a mano
    const vecchie = ["Grondaie", "Guaina impermeabilizzante"];
    catalogo = catalogo.filter((c) => !vecchie.includes(c.titolo));
    CATALOGO_BASE.forEach((c) => {
      const mia = catalogo.find((x) => x.titolo === c.titolo);
      if (mia) mia.cat = mia.cat || c.cat; else catalogo.push({ id: uid(), ...c });
    });
    catalogo.forEach((c) => c.cat = c.cat || "Altro");
    save("catalogo", catalogo); save("catv", 3);
  }
  let clienti = load("clienti", null) || CLIENTI_BASE.slice();
  let archivio = load("archivio", []);
  let prev = load("bozza", null) || nuovoPreventivo();

  function persist() {
    save("imp", impostazioni); save("catalogo", catalogo); save("clienti", clienti);
    save("archivio", archivio); save("bozza", prev);
  }

  function oggiISO() { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); }
  function isoToIt(iso) { const [y, m, d] = (iso || "").split("-"); return d ? `${d}/${m}/${y}` : ""; }

  function nuovoPreventivo() {
    return {
      id: null, numero: impostazioni.prossimoNumero, data: oggiISO(), riferimento: "",
      cliente: { nome: "", indirizzo: "", cf: "" }, oggetto: "", voci: [],
      opz: { sviluppo: true, cm: 100, piattaforma: true, separato: false, validita: false, giorni: 30,
             pagamento: false, pagTesto: "da concordare", libera: "" },
      totale: "",
    };
  }

  // ---------- Utilità ----------
  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const num = (v) => {
    let t = String(v ?? "").replace(/[^\d.,-]/g, "");
    if (t.includes(",")) t = t.replace(/\./g, "").replace(",", ".");
    else if (/^-?\d{1,3}(\.\d{3})+$/.test(t)) t = t.replace(/\./g, "");
    const n = parseFloat(t); return isNaN(n) ? 0 : n;
  };
  const dec = (n) => (Math.round(n * 100) / 100).toFixed(2).replace(".", ",").replace(/,00$/, "");
  const UNITA = { m: "m", mq: "m²", pz: "pz" };
  function creaVoce(c) {
    const v = { titolo: c.titolo, tipo: c.tipo, qta: "", prezzo: "", tpl: c.testo, importo: "", descManuale: false };
    v.descrizione = testoVoce(v); return v;
  }
  const numQ = (v) => String(v ?? "").replace(".", ",");
  const euro = (n) => PDFPrev.euro(n);

  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.classList.remove("hidden");
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.add("hidden"), 2200);
  }

  function testoVoce(v) { return (v.tpl || "").replace(/\{q\}/g, v.qta ? numQ(v.qta) : "___"); }

  function sommaVoci() { return prev.voci.reduce((a, v) => a + num(v.importo), 0); }
  function haImporti() { return prev.voci.some((v) => num(v.importo) > 0); }
  function totaleFinale() { return haImporti() ? sommaVoci() : num(prev.totale); }

  function note(p) {
    const o = p.opz, out = [];
    if (o.sviluppo) out.push(["Lattoneria:", `sviluppo della lamiera pari a ${(num(o.cm) / 100).toFixed(2).replace(".", ",")} m.`]);
    if (o.piattaforma) out.push(["Esecuzione:", "i lavori saranno eseguiti mediante piattaforma elevatrice."]);
    if (o.validita) out.push(["Validità:", `il presente preventivo è valido ${o.giorni || 30} giorni dalla data di emissione.`]);
    if (o.pagamento && o.pagTesto) out.push(["Pagamento:", o.pagTesto]);
    if (o.separato) out.push(["Nota:", "il presente preventivo è indipendente da altri preventivi e può essere accettato separatamente."]);
    if (o.libera && o.libera.trim()) out.push(["Note:", o.libera.trim()]);
    return out;
  }

  // ---------- Sheet (finestra dal basso) ----------
  function openSheet(title, html, bind) {
    $("#sheet-title").textContent = title; $("#sheet-body").innerHTML = html;
    $("#sheet").classList.remove("hidden"); bind && bind($("#sheet-body"));
  }
  function closeSheet() { $("#sheet").classList.add("hidden"); }
  $("#sheet-close").onclick = closeSheet;
  $("#sheet").addEventListener("click", (e) => { if (e.target.id === "sheet") closeSheet(); });

  // ---------- Tab ----------
  let tab = "nuovo";
  document.querySelectorAll(".tabs button").forEach((b) => b.onclick = () => {
    tab = b.dataset.tab;
    document.querySelectorAll(".tabs button").forEach((x) => x.classList.toggle("active", x === b));
    render(); window.scrollTo(0, 0);
  });

  function render() {
    if (tab === "nuovo") renderEditor();
    else if (tab === "archivio") renderArchivio();
    else renderImpostazioni();
  }

  // ---------- Editor preventivo ----------
  function renderEditor() {
    const p = prev, o = p.opz;
    const v = $("#view");
    v.innerHTML = `
      <h2>${p.id ? "Modifica preventivo" : "Nuovo preventivo"}</h2>
      <div class="card">
        <div class="row">
          <div><label>Numero</label><input id="numero" inputmode="numeric" value="${esc(p.numero)}"></div>
          <div><label>Data</label><input id="data" type="date" value="${esc(p.data)}"></div>
        </div>
        <label>Riferimento (facoltativo)</label>
        <input id="riferimento" placeholder="Es. Preventivo separato, aggiuntivo al n. 1" value="${esc(p.riferimento)}">
      </div>

      <h2>Cliente</h2>
      <div class="card">
        <button class="btn small" id="scegli-cliente">👤 Scegli cliente salvato</button>
        <label>Nome / ragione sociale</label><input id="c-nome" value="${esc(p.cliente.nome)}">
        <label>Indirizzo</label><textarea id="c-indirizzo" rows="2">${esc(p.cliente.indirizzo)}</textarea>
        <label>Codice fiscale / P. IVA</label><input id="c-cf" placeholder="Es. Codice fiscale: 00000000000" value="${esc(p.cliente.cf)}">
      </div>

      <h2>Oggetto</h2>
      <div class="card">
        <textarea id="oggetto" rows="2" placeholder="Descrizione generale dei lavori">${esc(p.oggetto)}</textarea>
        <div class="chips">${OGGETTI.map((t, i) => `<button class="chip" data-ogg="${i}">${esc(t.replace(/\.$/, ""))}</button>`).join("")}</div>
      </div>

      <h2>Lavori</h2>
      <button class="btn block" id="modello" style="margin-bottom:10px">📋 Parti da un lavoro tipo</button>
      <div id="voci">${p.voci.map(vocehtml).join("") || `<div class="card empty" style="padding:20px">Nessuna voce. Aggiungi i lavori qui sotto.</div>`}</div>
      <button class="btn primary block" id="add-voce" style="margin-top:10px">＋ Aggiungi lavoro</button>

      <h2>Note</h2>
      <div class="card">
        ${chk("sviluppo", o.sviluppo, "Sviluppo della lamiera", `<input class="mini" id="cm" inputmode="decimal" value="${esc(o.cm)}"> cm`)}
        ${chk("piattaforma", o.piattaforma, "Lavori con piattaforma elevatrice")}
        ${chk("validita", o.validita, "Validità del preventivo", `<input class="mini" id="giorni" inputmode="numeric" value="${esc(o.giorni)}"> giorni`)}
        ${chk("pagamento", o.pagamento, "Modalità di pagamento", `<input id="pagTesto" style="margin-top:6px" value="${esc(o.pagTesto)}">`)}
        ${chk("separato", o.separato, "Preventivo separato", "<small>Si può accettare da solo, indipendente da altri</small>")}
        <label>Altre note (facoltativo)</label><textarea id="libera" rows="2">${esc(o.libera)}</textarea>
      </div>

      <h2>Totale</h2>
      <div class="card">
        ${haImporti()
          ? `<div class="totale"><span>Somma delle voci</span><span class="big" id="tot-view">${euro(sommaVoci())}</span></div>
             <div class="hint">Calcolato dagli importi delle singole voci. IVA esclusa.</div>`
          : `<label>Totale a corpo, IVA esclusa (€)</label><input id="totale" inputmode="decimal" placeholder="Es. 2150" value="${esc(p.totale)}">
             <div class="hint">Oppure metti l’importo su ogni voce e lo calcolo io.</div>`}
      </div>

      <div class="actions">
        <button class="btn dark block" id="pdf">📄 Crea PDF e invia</button>
        <button class="btn block" id="anteprima">👁 Anteprima</button>
        <button class="btn ghost block" id="svuota">Ricomincia da zero</button>
      </div>`;

    const bindText = (id, set) => { const el = $("#" + id); if (el) el.oninput = () => { set(el.value); persist(); }; };
    bindText("numero", (x) => p.numero = x);
    bindText("data", (x) => p.data = x);
    bindText("riferimento", (x) => p.riferimento = x);
    bindText("c-nome", (x) => p.cliente.nome = x);
    bindText("c-indirizzo", (x) => p.cliente.indirizzo = x);
    bindText("c-cf", (x) => p.cliente.cf = x);
    bindText("oggetto", (x) => p.oggetto = x);
    bindText("cm", (x) => o.cm = x);
    bindText("giorni", (x) => o.giorni = x);
    bindText("pagTesto", (x) => o.pagTesto = x);
    bindText("libera", (x) => o.libera = x);
    bindText("totale", (x) => p.totale = x);

    v.querySelectorAll("[data-chk]").forEach((c) => c.onchange = () => { o[c.dataset.chk] = c.checked; persist(); });
    v.querySelectorAll("[data-ogg]").forEach((b) => b.onclick = () => { p.oggetto = OGGETTI[b.dataset.ogg]; $("#oggetto").value = p.oggetto; persist(); });

    bindVoci();
    $("#scegli-cliente").onclick = sceltaCliente;
    $("#add-voce").onclick = sceltaVoce;
    $("#modello").onclick = sceltaModello;
    $("#pdf").onclick = () => creaPdf(true);
    $("#anteprima").onclick = () => creaPdf(false);
    $("#svuota").onclick = () => {
      if (!confirm("Vuoi cancellare questo preventivo e ricominciare?")) return;
      prev = nuovoPreventivo(); persist(); render();
    };
  }

  function chk(key, on, title, extra = "") {
    return `<div class="check"><input type="checkbox" data-chk="${key}" ${on ? "checked" : ""} id="k-${key}">
      <div class="txt"><label for="k-${key}" style="margin:0;color:inherit;font-size:15px">${title}</label>${extra}</div></div>`;
  }

  function vocehtml(v, i) {
    const tipi = [["m", "Metri"], ["mq", "m²"], ["pz", "Pezzi"], ["corpo", "A corpo"]];
    return `<div class="card voce" data-i="${i}">
      <div class="voce-head"><b>${i + 1}.</b><input data-f="titolo" value="${esc(v.titolo)}" style="font-weight:700">
        <button class="btn small ghost" data-del>✕</button></div>
      <label>Quantità</label>
      <div class="qta-tipo">${tipi.map(([k, l]) => `<button data-tipo="${k}" class="${v.tipo === k ? "on" : ""}">${l}</button>`).join("")}</div>
      ${v.tipo !== "corpo" ? `<div class="row" style="margin-top:6px">
        <input data-f="qta" inputmode="decimal" placeholder="Quantità" value="${esc(v.qta)}">
        <input data-f="prezzo" inputmode="decimal" placeholder="€ al ${UNITA[v.tipo]} (facolt.)" value="${esc(v.prezzo)}"></div>` : ""}
      <label>Descrizione</label>
      <textarea data-f="descrizione" rows="3">${esc(v.descrizione)}</textarea>
      <label>Importo voce € (facoltativo)</label>
      <input data-f="importo" inputmode="decimal" placeholder="Lascia vuoto se metti il totale a corpo" value="${esc(v.importo)}">
      <div class="list-actions">
        ${i > 0 ? `<button class="btn small" data-move="-1">↑ Su</button>` : ""}
        ${i < prev.voci.length - 1 ? `<button class="btn small" data-move="1">↓ Giù</button>` : ""}
      </div>
    </div>`;
  }

  function bindVoci() {
    document.querySelectorAll(".voce").forEach((card) => {
      const i = +card.dataset.i, v = prev.voci[i];
      card.querySelectorAll("[data-f]").forEach((el) => el.oninput = () => {
        const f = el.dataset.f; v[f] = el.value;
        if (f === "descrizione") v.descManuale = true;
        if (f === "qta" && !v.descManuale) { v.descrizione = testoVoce(v); card.querySelector('[data-f="descrizione"]').value = v.descrizione; }
        if ((f === "qta" || f === "prezzo") && num(v.prezzo) > 0) {
          // prezzo unitario: l'importo della voce si calcola da solo
          v.importo = num(v.qta) > 0 ? dec(num(v.qta) * num(v.prezzo)) : "";
          card.querySelector('[data-f="importo"]').value = v.importo;
        }
        if (f === "importo" || f === "qta" || f === "prezzo") {
          const tv = $("#tot-view");
          // passaggio da totale manuale a somma voci (o viceversa): ridisegno conservando il focus
          if (!!tv !== haImporti()) { persist(); renderEditor(); const el2 = document.querySelector(`.voce[data-i="${i}"] [data-f="${f}"]`); el2 && (el2.focus(), el2.setSelectionRange(99, 99)); return; }
          if (tv) tv.textContent = euro(sommaVoci());
        }
        persist();
      });
      card.querySelectorAll("[data-tipo]").forEach((b) => b.onclick = () => {
        v.tipo = b.dataset.tipo; persist(); renderEditor();
      });
      card.querySelector("[data-del]").onclick = () => {
        if (!confirm(`Togliere "${v.titolo}"?`)) return;
        prev.voci.splice(i, 1); persist(); renderEditor();
      };
      card.querySelectorAll("[data-move]").forEach((b) => b.onclick = () => {
        const j = i + +b.dataset.move; [prev.voci[i], prev.voci[j]] = [prev.voci[j], prev.voci[i]];
        persist(); renderEditor();
      });
    });
  }

  function sceltaVoce() {
    openSheet("Scegli il lavoro", `
      <input class="search" id="cerca" placeholder="Cerca…">
      <div id="lista"><button class="pick" data-c="libera"><b>✏️ Voce libera</b><small>Scrivi tu titolo e descrizione</small></button>
      ${CATEGORIE.map((k) => { const voci = catalogo.map((c, i) => [c, i]).filter(([c]) => (c.cat || "Altro") === k);
        return voci.length ? `<div class="grp"><h2>${esc(k)}</h2>${voci.map(([c, i]) => `<button class="pick" data-c="${i}"><b>${esc(c.titolo)}</b>
        <small>${esc(c.testo.replace("{q}", "…").slice(0, 90))}${c.testo.length > 90 ? "…" : ""}</small></button>`).join("")}</div>` : ""; }).join("")}
      <button class="pick" data-c="libera" style="display:none"><b>✏️ Voce libera</b><small>Scrivi tu titolo e descrizione</small></button></div>`,
      (box) => {
        $("#cerca", box).oninput = (e) => {
          const t = e.target.value.toLowerCase();
          box.querySelectorAll(".pick").forEach((p) => p.style.display = p.textContent.toLowerCase().includes(t) ? "" : "none");
          box.querySelectorAll(".grp").forEach((g) => g.style.display = [...g.querySelectorAll(".pick")].some((p) => p.style.display !== "none") ? "" : "none");
        };
        box.querySelectorAll("[data-c]").forEach((b) => b.onclick = () => {
          const c = b.dataset.c === "libera" ? { titolo: "Nuova voce", tipo: "corpo", testo: "" } : catalogo[+b.dataset.c];
          prev.voci.push(creaVoce(c)); persist(); closeSheet(); renderEditor();
          const cards = document.querySelectorAll(".voce"); const last = cards[cards.length - 1];
          if (last) { last.scrollIntoView({ behavior: "smooth", block: "center" }); const q = last.querySelector('[data-f="qta"]'); q && setTimeout(() => q.focus(), 300); }
        });
      });
  }

  function sceltaModello() {
    openSheet("Lavori tipo", MODELLI.map((m, i) => `<button class="pick" data-m="${i}"><b>${esc(m.nome)}</b>
      <small>${m.voci.length} ${m.voci.length === 1 ? "voce" : "voci"}: ${esc(m.voci.join(", ").slice(0, 110))}…</small></button>`).join("") +
      `<div class="hint">Aggiunge le voci già scritte: poi metti solo quantità e prezzi, e togli quelle che non servono.</div>`,
      (box) => box.querySelectorAll("[data-m]").forEach((b) => b.onclick = () => {
        const m = MODELLI[+b.dataset.m];
        if (prev.voci.length && !confirm("Aggiungo queste voci a quelle che ci sono già?")) return;
        if (!prev.oggetto.trim()) prev.oggetto = m.oggetto;
        Object.assign(prev.opz, m.opz);
        m.voci.forEach((t) => { const c = catalogo.find((x) => x.titolo === t) || CATALOGO_BASE.find((x) => x.titolo === t); c && prev.voci.push(creaVoce(c)); });
        persist(); closeSheet(); renderEditor(); toast("Voci aggiunte: metti quantità e prezzi");
      }));
  }

  function sceltaCliente() {
    openSheet("Clienti salvati", clienti.length ? clienti.map((c, i) => `<button class="pick" data-k="${i}"><b>${esc(c.nome)}</b>
      <small>${esc((c.indirizzo || "").replace(/\n/g, ", "))}</small></button>`).join("") : `<div class="empty">Nessun cliente salvato.<br>Si salvano da soli quando crei un PDF.</div>`,
      (box) => box.querySelectorAll("[data-k]").forEach((b) => b.onclick = () => {
        prev.cliente = Object.assign({}, clienti[+b.dataset.k]); persist(); closeSheet(); renderEditor();
      }));
  }

  // ---------- PDF ----------
  let fontCache = null;
  async function fonts() {
    if (fontCache) return fontCache;
    const b64 = async (url) => {
      const buf = new Uint8Array(await (await fetch(url)).arrayBuffer());
      let s = ""; for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000));
      return btoa(s);
    };
    fontCache = { R: await b64("fonts/DejaVuSans.ttf"), B: await b64("fonts/DejaVuSans-Bold.ttf") };
    return fontCache;
  }

  function controlla() {
    const err = [];
    if (!prev.cliente.nome.trim()) err.push("il nome del cliente");
    if (!prev.oggetto.trim()) err.push("l’oggetto");
    if (!prev.voci.length) err.push("almeno un lavoro");
    if (!(totaleFinale() > 0)) err.push("il totale");
    prev.voci.forEach((v, i) => { if (v.tipo !== "corpo" && !String(v.qta).trim()) err.push(`la quantità della voce ${i + 1}`); });
    return err;
  }

  function datiPdf(p) {
    return {
      numero: p.numero, data: isoToIt(p.data), riferimento: p.riferimento.trim(),
      cliente: { nome: p.cliente.nome.trim(), indirizzo: p.cliente.indirizzo.trim(), cf: p.cliente.cf.trim() },
      oggetto: p.oggetto.trim(),
      voci: p.voci.map((v) => ({ titolo: v.titolo, tipo: v.tipo, qta: v.qta, descrizione: v.descrizione,
        prezzo: v.tipo !== "corpo" && num(v.prezzo) > 0 ? `${euro(num(v.prezzo))}/${UNITA[v.tipo]}` : "" })),
      note: note(p), totale: p.voci.some((v) => num(v.importo) > 0) ? p.voci.reduce((a, v) => a + num(v.importo), 0) : num(p.totale),
    };
  }

  async function pdfBlob(p) {
    const doc = PDFPrev.buildPdf(window.jspdf.jsPDF, await fonts(), datiPdf(p), impostazioni);
    return doc.output("blob");
  }

  function nomeFile(p) {
    const c = (p.cliente.nome || "cliente").replace(/[^\w\-]+/g, "_").replace(/_+/g, "_");
    return `Preventivo_${p.numero}_${c}.pdf`;
  }

  async function condividi(blob, nome, invia) {
    const file = new File([blob], nome, { type: "application/pdf" });
    if (invia && navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: nome }); return; }
      catch (e) { if (e.name === "AbortError") return; }
    }
    const url = URL.createObjectURL(blob);
    if (!invia) { window.open(url, "_blank") || scarica(url, nome); }
    else scarica(url, nome);
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }
  function scarica(url, nome) { const a = document.createElement("a"); a.href = url; a.download = nome; document.body.appendChild(a); a.click(); a.remove(); }

  async function creaPdf(invia) {
    const err = controlla();
    if (err.length) { alert("Manca: " + err.join(", ") + "."); return; }
    toast("Creo il PDF…");
    let blob;
    try { blob = await pdfBlob(prev); } catch (e) { console.error(e); alert("Errore nella creazione del PDF: " + e.message); return; }
    if (invia) {
      // salva in archivio e cliente
      const rec = JSON.parse(JSON.stringify(prev));
      rec.savedAt = Date.now(); rec.totaleCalc = totaleFinale();
      if (!rec.id) {
        rec.id = uid(); archivio.unshift(rec);
        const n = parseInt(rec.numero, 10);
        if (!isNaN(n) && n >= impostazioni.prossimoNumero) impostazioni.prossimoNumero = n + 1;
      } else {
        const k = archivio.findIndex((a) => a.id === rec.id);
        if (k >= 0) archivio[k] = rec; else archivio.unshift(rec);
      }
      const ci = clienti.findIndex((c) => c.nome.trim().toLowerCase() === rec.cliente.nome.trim().toLowerCase());
      if (ci >= 0) clienti[ci] = Object.assign({}, rec.cliente); else clienti.push(Object.assign({}, rec.cliente));
      prev.id = rec.id;
      persist();
    }
    await condividi(blob, nomeFile(prev), invia);
    if (invia) toast("Preventivo salvato in Archivio ✓");
  }

  // ---------- Archivio ----------
  function renderArchivio() {
    const v = $("#view");
    v.innerHTML = `<h2>Preventivi fatti</h2>
      ${archivio.length ? `<input class="search" id="cerca-arch" placeholder="Cerca cliente o numero…">` : ""}
      <div id="arch">${archivio.map((a, i) => `<div class="card" data-a="${i}">
        <div class="list-item"><div><b>N. ${esc(a.numero)} · ${esc(a.cliente.nome)}</b>
          <div class="meta">${isoToIt(a.data)} · ${esc(a.oggetto).slice(0, 60)}</div></div>
          <div class="amt">${euro(a.totaleCalc)}</div></div>
        <div class="list-actions">
          <button class="btn small dark" data-act="pdf">📄 PDF</button>
          <button class="btn small" data-act="apri">✏️ Modifica</button>
          <button class="btn small" data-act="duplica">⧉ Duplica</button>
          <button class="btn small ghost" data-act="elimina">Elimina</button>
        </div></div>`).join("") || `<div class="empty">Ancora nessun preventivo.<br>Quelli che crei finiscono qui.</div>`}</div>`;

    const s = $("#cerca-arch");
    if (s) s.oninput = () => { const t = s.value.toLowerCase(); v.querySelectorAll("[data-a]").forEach((c) => c.style.display = c.textContent.toLowerCase().includes(t) ? "" : "none"); };

    v.querySelectorAll("[data-a]").forEach((card) => {
      const a = archivio[+card.dataset.a];
      card.querySelectorAll("[data-act]").forEach((b) => b.onclick = async () => {
        const act = b.dataset.act;
        if (act === "pdf") { toast("Creo il PDF…"); await condividi(await pdfBlob(a), nomeFile(a), true); }
        if (act === "apri") { prev = JSON.parse(JSON.stringify(a)); persist(); vai("nuovo"); }
        if (act === "duplica") {
          prev = JSON.parse(JSON.stringify(a)); prev.id = null; prev.numero = impostazioni.prossimoNumero; prev.data = oggiISO();
          delete prev.savedAt; delete prev.totaleCalc; persist(); vai("nuovo"); toast("Copia creata: cambia quello che serve");
        }
        if (act === "elimina" && confirm(`Eliminare il preventivo n. ${a.numero} di ${a.cliente.nome}?`)) {
          archivio = archivio.filter((x) => x.id !== a.id); persist(); renderArchivio();
        }
      });
    });
  }

  function vai(t) { document.querySelector(`.tabs button[data-tab="${t}"]`).click(); }

  // ---------- Impostazioni ----------
  function renderImpostazioni() {
    const v = $("#view"), s = impostazioni;
    v.innerHTML = `
      <h2>Intestazione del PDF</h2>
      <div class="card">
        <label>Nome ditta</label><input id="s-ditta" value="${esc(s.ditta)}">
        <label>Sottotitolo</label><input id="s-sotto" value="${esc(s.sottotitolo)}">
        <label>Referente</label><input id="s-ref" value="${esc(s.referente)}">
        <label>Indirizzo</label><input id="s-ind" placeholder="Via, CAP, città" value="${esc(s.indirizzo)}">
        <div class="row"><div><label>P. IVA</label><input id="s-piva" value="${esc(s.piva)}"></div>
        <div><label>Telefono</label><input id="s-tel" inputmode="tel" value="${esc(s.telefono)}"></div></div>
        <label>Email</label><input id="s-mail" inputmode="email" value="${esc(s.email)}">
        <label>Prossimo numero preventivo</label><input id="s-num" inputmode="numeric" value="${esc(s.prossimoNumero)}">
      </div>

      <h2>Lavori pronti (${catalogo.length})</h2>
      <div class="hint" style="margin:0 4px 8px">Scrivi {q} nel testo dove va la quantità: si compila da solo.</div>
      ${catalogo.map((c, i) => `<div class="card"><div class="list-item"><div><b>${esc(c.titolo)}</b>
        <div class="meta">${esc(c.cat || "Altro")} · ${{ m: "Metri", mq: "m²", pz: "Pezzi", corpo: "A corpo" }[c.tipo]}</div></div>
        <div style="display:flex;gap:6px"><button class="btn small" data-ed="${i}">Modifica</button>
        <button class="btn small ghost" data-rm="${i}">✕</button></div></div></div>`).join("")}
      <button class="btn primary block" id="add-cat" style="margin-top:10px">＋ Nuovo lavoro pronto</button>

      <h2>Clienti salvati (${clienti.length})</h2>
      ${clienti.map((c, i) => `<div class="card"><div class="list-item"><div><b>${esc(c.nome)}</b>
        <div class="meta">${esc((c.indirizzo || "").replace(/\n/g, ", "))}</div></div>
        <button class="btn small ghost" data-rc="${i}">✕</button></div></div>`).join("") || `<div class="hint" style="margin:0 4px">Nessuno.</div>`}

      <h2>Copia di sicurezza</h2>
      <div class="card">
        <div class="hint" style="margin-top:0">I dati restano solo su questo telefono. Fai una copia ogni tanto, o prima di cambiare telefono.</div>
        <div class="list-actions"><button class="btn small dark" id="backup">⬇ Salva copia</button>
        <label class="btn small" style="margin:0;color:inherit">⬆ Ripristina<input type="file" id="restore" accept="application/json" hidden></label></div>
      </div>
      <div class="hint" style="text-align:center;margin:24px 0 6px">Preventivi E.M. Edilizia · v1.2</div>`;

    const b = (id, f) => { $("#" + id).oninput = (e) => { f(e.target.value); persist(); }; };
    b("s-ditta", (x) => s.ditta = x); b("s-sotto", (x) => s.sottotitolo = x); b("s-ref", (x) => s.referente = x);
    b("s-ind", (x) => s.indirizzo = x); b("s-piva", (x) => s.piva = x); b("s-tel", (x) => s.telefono = x); b("s-mail", (x) => s.email = x);
    b("s-num", (x) => { const n = parseInt(x, 10); if (!isNaN(n)) { s.prossimoNumero = n; if (!prev.id) prev.numero = n; } });

    v.querySelectorAll("[data-ed]").forEach((x) => x.onclick = () => modificaCat(+x.dataset.ed));
    v.querySelectorAll("[data-rm]").forEach((x) => x.onclick = () => {
      if (confirm(`Togliere "${catalogo[+x.dataset.rm].titolo}" dai lavori pronti?`)) { catalogo.splice(+x.dataset.rm, 1); persist(); renderImpostazioni(); }
    });
    v.querySelectorAll("[data-rc]").forEach((x) => x.onclick = () => {
      if (confirm(`Togliere il cliente "${clienti[+x.dataset.rc].nome}"?`)) { clienti.splice(+x.dataset.rc, 1); persist(); renderImpostazioni(); }
    });
    $("#add-cat").onclick = () => modificaCat(-1);
    $("#backup").onclick = () => {
      const blob = new Blob([JSON.stringify({ impostazioni, catalogo, clienti, archivio }, null, 1)], { type: "application/json" });
      const url = URL.createObjectURL(blob); scarica(url, `backup_preventivi_${oggiISO()}.json`); setTimeout(() => URL.revokeObjectURL(url), 30000);
    };
    $("#restore").onchange = async (e) => {
      const f = e.target.files[0]; if (!f) return;
      try {
        const d = JSON.parse(await f.text());
        if (!confirm("Sostituire i dati attuali con quelli della copia?")) return;
        impostazioni = Object.assign({}, IMPOSTAZIONI_BASE, d.impostazioni || {});
        catalogo = d.catalogo || catalogo; clienti = d.clienti || clienti; archivio = d.archivio || archivio;
        persist(); renderImpostazioni(); toast("Dati ripristinati ✓");
      } catch { alert("File non valido."); }
    };
  }

  function modificaCat(i) {
    const c = i >= 0 ? catalogo[i] : { titolo: "", tipo: "m", testo: "", cat: "Altro" };
    openSheet(i >= 0 ? "Modifica lavoro" : "Nuovo lavoro", `
      <label>Titolo</label><input id="m-tit" value="${esc(c.titolo)}">
      <label>Categoria</label>
      <select id="m-cat">${CATEGORIE.map((k) => `<option ${(c.cat || "Altro") === k ? "selected" : ""}>${esc(k)}</option>`).join("")}</select>
      <label>Quantità di solito in</label>
      <select id="m-tipo">${[["m", "Metri"], ["mq", "m²"], ["pz", "Pezzi"], ["corpo", "A corpo"]].map(([k, l]) => `<option value="${k}" ${c.tipo === k ? "selected" : ""}>${l}</option>`).join("")}</select>
      <label>Descrizione (usa {q} per la quantità)</label><textarea id="m-txt" rows="5">${esc(c.testo)}</textarea>
      <button class="btn primary block" id="m-ok" style="margin-top:14px">Salva</button>`,
      (box) => $("#m-ok", box).onclick = () => {
        const n = { id: c.id || uid(), cat: $("#m-cat").value, titolo: $("#m-tit").value.trim(), tipo: $("#m-tipo").value, testo: $("#m-txt").value.trim() };
        if (!n.titolo) { alert("Scrivi almeno il titolo."); return; }
        if (i >= 0) catalogo[i] = n; else catalogo.push(n);
        persist(); closeSheet(); renderImpostazioni();
      });
  }

  // ---------- Avvio ----------
  render();
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
})();
