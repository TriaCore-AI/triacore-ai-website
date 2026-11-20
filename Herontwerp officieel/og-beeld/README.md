# Deelbeeld (og-beeld)

Het beeld dat LinkedIn, WhatsApp, Slack en co. tonen als iemand een link naar triacore.be deelt: `public/og/triacore-og.png` (1200 × 630). Gemaakt op 20 november 2026 uit `og-beeld.html`: het verloop van de site, het logo, en de tagline in Cormorant Garamond met het groene accent, zoals de hero van de homepage.

Aanpassen: wijzig `og-beeld.html` en render opnieuw met Edge zonder venster (in Git Bash, vanuit deze map):

```
W=$(cygpath -m "$PWD")
"/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --window-size=1200,630 --virtual-time-budget=8000 --screenshot="$W/triacore-og.png" "file:///$W/og-beeld.html"
```

Kopieer het resultaat naar `public/og/triacore-og.png`. LinkedIn bewaart oude voorvertoningen een tijd; vernieuwen kan via de Post Inspector van LinkedIn.
