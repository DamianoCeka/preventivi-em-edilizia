// Genera il PDF del preventivo con la stessa grafica dei preventivi E.M. Edilizia.
// buildPdf(jsPDF, fonts, preventivo, impostazioni) -> istanza jsPDF
(function (root) {
  const W = 595.28, H = 841.89, L = 42, R = W - 42;
  const DARK = [31, 41, 55], GREY = [107, 114, 128], LINE = [209, 213, 219],
        BAND = [241, 243, 245], ACC = [180, 83, 9];

  function euro(n) {
    // formattazione manuale: in it-IT 2150 diventerebbe "2150" senza punto delle migliaia
    const [int, dec] = Math.abs(Number(n || 0)).toFixed(2).split(".");
    return (n < 0 ? "-" : "") + int.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "," + dec + " €";
  }

  function qtaLabel(v) {
    const n = String(v.qta || "").replace(".", ",");
    switch (v.tipo) {
      case "m": return n ? `Circa ${n} m` : "—";
      case "mq": return n ? `Circa ${n} m²` : "—";
      case "pz": return n ? `${n} pz` : "—";
      default: return "A corpo";
    }
  }

  function buildPdf(jsPDF, fonts, q, s) {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    doc.addFileToVFS("R.ttf", fonts.R); doc.addFont("R.ttf", "R", "normal");
    doc.addFileToVFS("B.ttf", fonts.B); doc.addFont("B.ttf", "B", "normal");
    doc.setProperties({ title: `Preventivo ${q.numero} - ${q.cliente.nome}`, author: s.ditta });

    const fill = (c) => doc.setFillColor(...c);
    const color = (c) => doc.setTextColor(...c);
    const font = (f, size) => { doc.setFont(f, "normal"); doc.setFontSize(size); };
    const txt = (t, x, y, opt) => doc.text(String(t), x, y, opt);
    const hline = (y) => { doc.setDrawColor(...LINE); doc.setLineWidth(0.7); doc.line(L, y, R, y); };

    function para(text, x, y, width, f = "R", size = 8.6, lead = 12.2, c = DARK) {
      font(f, size); color(c);
      const lines = doc.splitTextToSize(String(text || ""), width);
      lines.forEach((ln) => { txt(ln, x, y); y += lead; });
      return y;
    }
    function band() { fill(ACC); doc.rect(0, 0, W, 6, "F"); }
    function ensure(y, need) {
      if (y + need <= H - 70) return y;
      doc.addPage(); band(); return 50;
    }

    // Intestazione
    band();
    color(DARK); font("B", 17); txt(s.ditta, L, 52);
    font("R", 8.5); color(GREY);
    txt(s.sottotitolo, L, 70);
    txt(s.referente, L, 83);
    color(DARK); font("B", 17); txt(`PREVENTIVO N. ${q.numero}`, R, 52, { align: "right" });
    font("R", 8.5); color(GREY); txt(`Data: ${q.data}`, R, 70, { align: "right" });
    if (q.riferimento) { color(ACC); font("B", 8); txt(q.riferimento, R, 83, { align: "right" }); }
    const contatti = [s.indirizzo, s.piva && "P. IVA " + s.piva, s.telefono && "Tel. " + s.telefono, s.email]
      .map((x) => (x || "").trim()).filter(Boolean).join("  ·  ");
    let top = 100;
    if (contatti) {
      font("R", 7.8); color(GREY);
      const righe = doc.splitTextToSize(contatti, R - L);
      righe.forEach((r, i) => txt(r, L, 96 + i * 11));
      top = 96 + righe.length * 11 + 2;
    }
    hline(top);

    // Cliente
    let y = top + 24;
    font("B", 7.5); color(GREY); txt("SPETT.LE", L, y);
    font("B", 10.5); color(DARK); txt(q.cliente.nome.toUpperCase(), L, y + 16);
    font("R", 8.6);
    let cy = y + 33;
    (q.cliente.indirizzo || "").split("\n").filter(Boolean).forEach((r) => { txt(r, L, cy); cy += 15; });
    if (q.cliente.cf) { txt(q.cliente.cf, L, cy); cy += 15; }
    y = Math.max(cy + 13, y + 76);

    // Oggetto
    font("B", 7.5); color(GREY); txt("OGGETTO", L, y);
    y = para(q.oggetto, L, y + 20, R - L);

    // Tabella voci
    y += 14;
    const qx = R - 90;
    function tableHead() {
      fill(BAND); doc.rect(L, y - 8, R - L, 30, "F");
      fill(ACC); doc.rect(L, y - 8, 3, 30, "F");
      color(DARK); font("B", 7.8);
      txt("DESCRIZIONE DEI LAVORI", L + 12, y + 10);
      txt("QUANTITÀ", qx, y + 10);
      y += 22;
    }
    tableHead();
    q.voci.forEach((v) => {
      font("R", 8.6);
      const nLines = doc.splitTextToSize(v.descrizione || "", qx - L - 30).length;
      const need = 18 + 13 + nLines * 12.2 + 6;
      const ny = ensure(y, need);
      if (ny !== y) { y = ny; tableHead(); }
      y += 18;
      font("B", 8.8); color(DARK); txt(v.titolo, L + 12, y);
      font("R", 8.6); txt(qtaLabel(v), qx, y);
      if (v.prezzo) { font("R", 7.5); color(GREY); txt(v.prezzo, qx, y + 12); color(DARK); }
      y = para(v.descrizione, L + 12, y + 13, qx - L - 30);
      y -= 6;
      hline(y);
    });

    // Note
    y += 20;
    q.note.forEach(([k, val]) => {
      font("B", 7.8);
      const kw = doc.getTextWidth(k + " ");
      font("R", 7.8);
      const n = doc.splitTextToSize(val, R - L - 24 - kw).length;
      y = ensure(y, n * 11 + 6);
      font("B", 7.8); color(GREY); txt(k, L + 12, y);
      y = para(val, L + 12 + kw, y, R - L - 24 - kw, "R", 7.8, 11, GREY);
      y += 6;
    });

    // Totale
    y = ensure(y + 10, 46 + 84);
    fill(BAND); doc.rect(L, y - 6, R - L, 46, "F");
    fill(ACC); doc.rect(L, y - 6, 3, 46, "F");
    color(DARK); font("B", 10); txt("Totale preventivo, IVA esclusa", L + 12, y + 13);
    font("R", 7.8); color(GREY); txt("Importo complessivo a corpo. IVA esclusa.", L + 12, y + 28);
    font("B", 15); color(DARK); txt(euro(q.totale), R - 12, y + 22, { align: "right" });
    y += 40;

    // Firme
    y += 70;
    doc.setDrawColor(...LINE); doc.setLineWidth(0.7);
    doc.line(L, y, L + 180, y); doc.line(R - 180, y, R, y);
    font("R", 7.5); color(GREY);
    txt("Firma impresa", L, y + 12);
    txt("Firma cliente per accettazione", R, y + 12, { align: "right" });

    // Piè di pagina su ogni pagina
    const tot = doc.getNumberOfPages();
    for (let i = 1; i <= tot; i++) {
      doc.setPage(i);
      hline(H - 46);
      font("R", 7); color(GREY);
      txt(`${q.cliente.nome} - Preventivo n. ${q.numero}`, L, H - 34);
      txt(`${i} / ${tot}`, R, H - 34, { align: "right" });
    }
    return doc;
  }

  const api = { buildPdf, euro, qtaLabel };
  if (typeof module !== "undefined") module.exports = api; else root.PDFPrev = api;
})(this);
