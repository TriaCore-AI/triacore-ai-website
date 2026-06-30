// =============================================================
// Aankondig-script: zet een nieuwe resource als CONCEPT-broadcast in Resend.
//
// Dit script VERSTUURT NOOIT. Het maakt enkel een concept aan; jij bekijkt de
// HTML in Resend, stuurt een testmail naar jezelf en klikt zelf Verzenden.
//
// Gebruik:
//   npm run announce -- <slug>      (of geen slug = de meest recente resource)
// Onder de motorkap: node --env-file-if-exists=.env scripts/announce-resource.mjs <slug>
//
// Vereist env: RESEND_API_KEY, RESEND_AUDIENCE_ID, NEWSLETTER_FROM
// Optioneel:   NEWSLETTER_REPLY_TO
// =============================================================
import { createInterface } from 'node:readline/promises';
import { Resend } from 'resend';
import { resourceBroadcast, SITE_URL } from '../lib/email-template.js';
import { loadResources } from './load-resources.mjs';

async function confirm(question) {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    const answer = (await rl.question(question)).trim().toLowerCase();
    rl.close();
    return answer === 'j' || answer === 'ja' || answer === 'y' || answer === 'yes';
}

async function main() {
    const slugArg = process.argv[2];
    const { resources, CATEGORIES } = await loadResources();

    if (!resources.length) {
        console.error('Geen resources gevonden in', RESOURCES_FILE);
        process.exit(1);
    }

    // Resource kiezen: per slug, anders de meest recente op datum.
    const resource = slugArg
        ? resources.find((r) => r.slug === slugArg)
        : [...resources].sort((a, b) => (a.date < b.date ? 1 : -1))[0];

    if (!resource) {
        console.error(`Geen resource met slug "${slugArg}". Beschikbaar:`);
        resources.forEach((r) => console.error('  -', r.slug));
        process.exit(1);
    }

    const { RESEND_API_KEY, RESEND_AUDIENCE_ID, NEWSLETTER_FROM, NEWSLETTER_REPLY_TO } = process.env;
    if (!RESEND_API_KEY || !RESEND_AUDIENCE_ID || !NEWSLETTER_FROM) {
        console.error('Ontbrekende env-variabelen. Nodig: RESEND_API_KEY, RESEND_AUDIENCE_ID, NEWSLETTER_FROM');
        console.error('Tip: draai via "npm run announce" zodat .env wordt ingeladen.');
        process.exit(1);
    }

    const title = resource.title?.nl || resource.title;
    const description = resource.description?.nl || resource.description || '';
    const categoryLabel = CATEGORIES[resource.category]?.nl;
    const url = `${SITE_URL}/resources/${resource.slug}`;

    // Veiligheidscheck: staat de resource al live? (anders 404-link in de mail)
    let liveStatus = 'onbekend';
    try {
        const res = await fetch(url, { method: 'HEAD' });
        liveStatus = res.ok ? `live (${res.status})` : `NIET live (${res.status})`;
    } catch {
        liveStatus = 'niet bereikbaar';
    }

    const { subject, previewText, html } = resourceBroadcast({
        title,
        description,
        thumbnail: resource.thumbnail,
        slug: resource.slug,
        categoryLabel,
    });

    const broadcastName = `Resource: ${resource.slug}`;
    const resend = new Resend(RESEND_API_KEY);

    // Idempotent: bestaat er al een broadcast met deze naam?
    try {
        const existing = await resend.broadcasts.list();
        const dup = (existing.data?.data || []).find((b) => b.name === broadcastName);
        if (dup) {
            console.log(`\n⚠  Er bestaat al een broadcast "${broadcastName}" (status: ${dup.status}).`);
            console.log('   Open die in Resend in plaats van een dubbel concept te maken:');
            console.log(`   https://resend.com/broadcasts/${dup.id}\n`);
            process.exit(0);
        }
    } catch {
        // lijst opvragen mislukt -> niet blokkeren, gewoon doorgaan
    }

    console.log('\n──────────────────────────────────────────────');
    console.log('  CONCEPT-broadcast aanmaken in Resend');
    console.log('──────────────────────────────────────────────');
    console.log('  Naam      :', broadcastName);
    console.log('  Onderwerp :', subject);
    console.log('  Titel     :', title);
    console.log('  Link      :', url, `(${liveStatus})`);
    console.log('  Afzender  :', NEWSLETTER_FROM);
    console.log('  Audience  :', RESEND_AUDIENCE_ID);
    console.log('──────────────────────────────────────────────');
    if (!liveStatus.startsWith('live')) {
        console.log('  ⚠  De resource lijkt nog NIET live. De link in de mail kan dan');
        console.log('     naar een 404 wijzen. Publiceer eerst, of ga toch door als test.');
        console.log('──────────────────────────────────────────────');
    }
    console.log('  Er wordt NIETS verstuurd. Dit maakt enkel een concept.\n');

    const ok = await confirm('Concept aanmaken? (j/N) ');
    if (!ok) {
        console.log('Geannuleerd. Geen concept aangemaakt.');
        process.exit(0);
    }

    const { data, error } = await resend.broadcasts.create({
        name: broadcastName,
        audienceId: RESEND_AUDIENCE_ID,
        from: NEWSLETTER_FROM,
        ...(NEWSLETTER_REPLY_TO ? { replyTo: NEWSLETTER_REPLY_TO } : {}),
        subject,
        previewText,
        html,
    });

    if (error) {
        console.error('\n✗ Aanmaken mislukt:', error);
        process.exit(1);
    }

    console.log('\n✓ Concept aangemaakt in Resend.');
    console.log('  Open, bekijk de HTML, stuur een testmail naar jezelf, en verstuur pas daarna:');
    console.log(`  https://resend.com/broadcasts/${data.id}\n`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
