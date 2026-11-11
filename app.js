/* Preventivi E.M. Edilizia — tutto salvato sul telefono (localStorage), PDF generato in locale. */
(function () {
  "use strict";

  // ---------- Dati predefiniti ----------
  const IMPOSTAZIONI_BASE = {
    ditta: "E.M. EDILIZIA",
    sottotitolo: "Coperture  ·  Isolamenti  ·  Lattonerie",
    referente: "Gallushi Rexhep",
    prossimoNumero: 1,
  };

  // {q} viene sostituito con la quantità inserita
  const CATALOGO_BASE = [
    { titolo: "Rivestimento del muretto", tipo: "m",
      testo: "Completamento del rivestimento in lattoneria nelle parti mancanti del muretto, per una lunghezza complessiva di circa {q} metri lineari." },
    { titolo: "Sostituzione lattoneria danneggiata", tipo: "m",
      testo: "Rimozione della lattoneria danneggiata e fornitura e posa in opera della nuova lattoneria, per una lunghezza complessiva di circa {q} metri lineari." },
    { titolo: "Copertina in alluminio", tipo: "corpo",
      testo: "Fornitura e posa in opera di copertina in alluminio, colore bianco/grigio, con fissaggio meccanico." },
    { titolo: "Sfiati mancanti", tipo: "corpo",
      testo: "Fornitura e posa in opera degli sfiati mancanti in copertura, comprensiva di posizionamento e fissaggio." },
    { titolo: "Scossaline dei lucernari", tipo: "corpo",
      testo: "Realizzazione e posa di scossaline in lattoneria attorno ai lucernari interessati da infiltrazioni d’acqua, a protezione dei raccordi con la copertura." },
    { titolo: "Grondaie", tipo: "m",
      testo: "Fornitura e posa in opera di grondaie in lamiera, complete di staffe, testate e accessori di fissaggio, per circa {q} metri lineari." },
    { titolo: "Pluviali", tipo: "m",
      testo: "Fornitura e posa in opera di pluviali in lamiera, completi di collari e raccordi, per circa {q} metri lineari." },
    { titolo: "Pulizia grondaie e pluviali", tipo: "corpo",
      testo: "Pulizia di grondaie e pluviali con rimozione di foglie e detriti e verifica del corretto deflusso dell’acqua." },
    { titolo: "Guaina impermeabilizzante", tipo: "mq",
      testo: "Fornitura e posa in opera di guaina bituminosa impermeabilizzante, per una superficie di circa {q} m²." },
    { titolo: "Isolamento della copertura", tipo: "mq",
      testo: "Fornitura e posa in opera di pannelli isolanti in copertura, per una superficie di circa {q} m²." },
  ];

  const CLIENTI_BASE = [];

  const OGGETTI = [
    "Lavori di completamento e sistemazione delle lattonerie in copertura.",
    "Sostituzione della lattoneria danneggiata.",
    "Lavori di impermeabilizzazione della copertura.",
    "Fornitura e posa di grondaie e pluviali.",
  ];

  // ---------- Archivio locale ----------
  const load = (k, def) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? def; } catch { return def; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  let impostazioni = Object.assign({}, IMPOSTAZIONI_BASE, load("imp", {}));
  let catalogo = load("catalogo", null) || CATALOGO_BASE.map((c) => ({ id: uid(), ...c }));
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
  const num = (v) => { const n = parseFloat(String(v ?? "").replace(/\./g, "").replace(",", ".")); return isNaN(n) ? 0 : n; };
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
      ${v.tipo !== "corpo" ? `<input data-f="qta" inputmode="decimal" placeholder="Quantità" value="${esc(v.qta)}" style="margin-top:6px">` : ""}
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
        if (f === "importo") {
          const tv = $("#tot-view");
          // passaggio da totale manuale a somma voci (o viceversa): ridisegno conservando il focus
          if (!!tv !== haImporti()) { persist(); renderEditor(); const el2 = document.querySelector(`.voce[data-i="${i}"] [data-f="importo"]`); el2 && (el2.focus(), el2.setSelectionRange(99, 99)); return; }
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
      <div id="lista">${catalogo.map((c, i) => `<button class="pick" data-c="${i}"><b>${esc(c.titolo)}</b>
        <small>${esc(c.testo.replace("{q}", "…").slice(0, 90))}${c.testo.length > 90 ? "…" : ""}</small></button>`).join("")}
      <button class="pick" data-c="libera"><b>✏️ Voce libera</b><small>Scrivi tu titolo e descrizione</small></button></div>`,
      (box) => {
        $("#cerca", box).oninput = (e) => {
          const t = e.target.value.toLowerCase();
          box.querySelectorAll(".pick").forEach((p) => p.style.display = p.textContent.toLowerCase().includes(t) ? "" : "none");
        };
        box.querySelectorAll("[data-c]").forEach((b) => b.onclick = () => {
          const c = b.dataset.c === "libera" ? { titolo: "Nuova voce", tipo: "corpo", testo: "" } : catalogo[+b.dataset.c];
          const v = { titolo: c.titolo, tipo: c.tipo, qta: "", tpl: c.testo, importo: "", descManuale: false };
          v.descrizione = testoVoce(v);
          prev.voci.push(v); persist(); closeSheet(); renderEditor();
          const cards = document.querySelectorAll(".voce"); const last = cards[cards.length - 1];
          if (last) { last.scrollIntoView({ behavior: "smooth", block: "center" }); const q = last.querySelector('[data-f="qta"]'); q && setTimeout(() => q.focus(), 300); }
        });
      });
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
      voci: p.voci.map((v) => ({ titolo: v.titolo, tipo: v.tipo, qta: v.qta, descrizione: v.descrizione })),
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
        <label>Prossimo numero preventivo</label><input id="s-num" inputmode="numeric" value="${esc(s.prossimoNumero)}">
      </div>

      <h2>Lavori pronti (${catalogo.length})</h2>
      <div class="hint" style="margin:0 4px 8px">Scrivi {q} nel testo dove va la quantità: si compila da solo.</div>
      ${catalogo.map((c, i) => `<div class="card"><div class="list-item"><div><b>${esc(c.titolo)}</b>
        <div class="meta">${{ m: "Metri", mq: "m²", pz: "Pezzi", corpo: "A corpo" }[c.tipo]}</div></div>
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
      <div class="hint" style="text-align:center;margin:24px 0 6px">Preventivi E.M. Edilizia · v1.0</div>`;

    const b = (id, f) => { $("#" + id).oninput = (e) => { f(e.target.value); persist(); }; };
    b("s-ditta", (x) => s.ditta = x); b("s-sotto", (x) => s.sottotitolo = x); b("s-ref", (x) => s.referente = x);
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
    const c = i >= 0 ? catalogo[i] : { titolo: "", tipo: "m", testo: "" };
    openSheet(i >= 0 ? "Modifica lavoro" : "Nuovo lavoro", `
      <label>Titolo</label><input id="m-tit" value="${esc(c.titolo)}">
      <label>Quantità di solito in</label>
      <select id="m-tipo">${[["m", "Metri"], ["mq", "m²"], ["pz", "Pezzi"], ["corpo", "A corpo"]].map(([k, l]) => `<option value="${k}" ${c.tipo === k ? "selected" : ""}>${l}</option>`).join("")}</select>
      <label>Descrizione (usa {q} per la quantità)</label><textarea id="m-txt" rows="5">${esc(c.testo)}</textarea>
      <button class="btn primary block" id="m-ok" style="margin-top:14px">Salva</button>`,
      (box) => $("#m-ok", box).onclick = () => {
        const n = { id: c.id || uid(), titolo: $("#m-tit").value.trim(), tipo: $("#m-tipo").value, testo: $("#m-txt").value.trim() };
        if (!n.titolo) { alert("Scrivi almeno il titolo."); return; }
        if (i >= 0) catalogo[i] = n; else catalogo.push(n);
        persist(); closeSheet(); renderImpostazioni();
      });
  }

  // ---------- Avvio ----------
  render();
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
})();
