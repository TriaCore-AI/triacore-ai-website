// De controle van het contactformulier en het workshopformulier, zonder schermonderdelen (die staan in
// formulier-fouten.jsx). Hoe het werkt (20/11, vraag Lucas: niemand mag afhaken op een formulier dat niet zegt
// wat er mis is):
// - De verstuurknop is altijd aan te klikken, nooit grijs. Ontbreekt er nog iets, dan krijgt dat veld een rode
//   rand met een korte uitleg eronder, staat naast de knop hoeveel velden nog aandacht vragen, en springt de
//   cursor naar het eerste veld dat nog niet klopt.
// - Een veld wordt gecontroleerd zodra je het verlaat (en er iets in staat), niet terwijl je nog typt. Staat een
//   veld eenmaal in het rood, dan verdwijnt het rood meteen zodra het klopt.
// - Bij een e-mailadres zegt de uitleg wat er precies ontbreekt (een @, de extensie zoals .be of .com, ...), en
//   bij een bekende typfout (gmial.com) stelt het formulier de verbetering voor, met één klik over te nemen.

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

// De uitleg bij een e-mailadres dat (nog) niet klopt, of null als het in orde is
export function emailFout(waarde, nl) {
    const v = waarde.trim();
    if (!v) return nl ? 'Vul je e-mailadres in.' : 'Enter your email address.';
    if (/\s/.test(v)) return nl ? 'Er staat een spatie in je e-mailadres.' : 'There is a space in your email address.';
    const delen = v.split('@');
    if (delen.length === 1) return nl ? 'Er ontbreekt een @, bijvoorbeeld naam@bedrijf.be.' : 'The @ is missing, for example name@company.com.';
    if (delen.length > 2) return nl ? 'Er staat meer dan één @ in je e-mailadres.' : 'There is more than one @ in your email address.';
    const [voor, na] = delen;
    if (!voor) return nl ? 'Er ontbreekt iets voor de @.' : 'Something is missing before the @.';
    if (!na) return nl ? 'Er ontbreekt iets na de @, bijvoorbeeld bedrijf.be.' : 'Something is missing after the @, for example company.com.';
    if (!na.includes('.')) return nl ? 'Er ontbreekt nog een extensie, zoals .be of .com.' : 'The ending is missing, such as .com or .be.';
    const extensie = na.split('.').pop();
    if (extensie.length < 2 || na.startsWith('.') || na.includes('..')) {
        return nl ? 'Het deel na de @ lijkt onvolledig, bijvoorbeeld bedrijf.be.' : 'The part after the @ looks incomplete, for example company.com.';
    }
    return null;
}

// Veelvoorkomende typfouten in het deel na de @, met de verbetering
const TYPFOUTEN = {
    'gmial.com': 'gmail.com', 'gmai.com': 'gmail.com', 'gmal.com': 'gmail.com', 'gamil.com': 'gmail.com',
    'gnail.com': 'gmail.com', 'gmail.co': 'gmail.com', 'gmail.con': 'gmail.com', 'gmail.cm': 'gmail.com',
    'gmail.be': 'gmail.com', 'hotmial.com': 'hotmail.com', 'hotmal.com': 'hotmail.com', 'hotmail.co': 'hotmail.com',
    'hotmail.con': 'hotmail.com', 'hotmial.be': 'hotmail.be', 'outlok.com': 'outlook.com', 'outlook.co': 'outlook.com',
    'outlook.con': 'outlook.com', 'outloo.com': 'outlook.com', 'icloud.co': 'icloud.com', 'iclod.com': 'icloud.com',
    'yaho.com': 'yahoo.com', 'telenet.bee': 'telenet.be', 'skynet.bee': 'skynet.be'
};

// Een voorstel als het e-mailadres op een bekende typfout lijkt, anders null
export function emailVoorstel(waarde) {
    const v = waarde.trim();
    const at = v.lastIndexOf('@');
    if (at < 1) return null;
    const domein = v.slice(at + 1).toLowerCase();
    let beter = TYPFOUTEN[domein];
    if (!beter && /\.(con|cmo|comm|vom)$/.test(domein)) beter = domein.replace(/\.(con|cmo|comm|vom)$/, '.com');
    return beter ? `${v.slice(0, at)}@${beter}` : null;
}

// Rode rand voor een veld met een fout, in plaats van de gewone grijze
export const foutRand = (fout) => (fout ? '!border-red-400 hover:!border-red-500 focus:!border-red-500' : '');

// Welke fouten zichtbaar zijn: na een poging tot versturen alle, anders enkel die van velden die je al verlaten
// hebt met iets erin (aangeraakt)
export const zichtbareFouten = (alle, poging, aangeraakt) =>
    poging ? alle : Object.fromEntries(Object.entries(alle).filter(([id]) => aangeraakt[id]));

// Zet de cursor op het eerste veld met een fout. De fouten zijn opgeslagen per id van het veld; volgorde is de
// lijst van die id's zoals ze op het scherm staan
export const naarEersteFout = (fouten, volgorde) => {
    const eerste = volgorde.find((id) => fouten[id]);
    if (!eerste) return;
    const el = document.getElementById(eerste);
    el?.focus({ preventScroll: true });
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
};
