// De maat van de visuals in de kiezer van Custom tools: u(11) is 11 eenheden van het vaste canvas, zodat de
// verhoudingen op elk formaat gelijk blijven. --u wordt gezet op het canvas (ToolStage in tool-visual-parts.jsx).
export const u = (n) => `calc(var(--u) * ${n})`;
