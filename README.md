# 🌬 Lüftungscheck – PWA

Prüft ob Lüften gerade sinnvoll ist – mit 48h-Wetterprognose für deine PLZ.

## Projekt-Struktur

```
lueftungscheck/
├── index.html         ← Haupt-App
├── manifest.json       ← PWA-Manifest (Homescreen-Installation)
├── sw.js               ← Service Worker (Offline-Support)
├── icons/
│   ├── icon-192.png    ← Platzhalter, s. Hinweis unten
│   └── icon-512.png    ← Platzhalter, s. Hinweis unten
└── README.md
```

> ⚠️ **Die Icons sind aktuell einfache Platzhalter** (abstrakte Grafik in
> den App-Farben), keine gestalteten App-Icons. Sie funktionieren technisch,
> sollten aber vor einer "richtigen" Veröffentlichung ersetzt werden.

---

## Schritt-für-Schritt: Auf GitHub Pages veröffentlichen

### 1. Neues Repository erstellen

1. Gehe auf [github.com](https://github.com) und melde dich an
2. Klicke oben rechts auf das **„+"** → **„New repository"**
3. Repository-Name eingeben, z. B. `lueftungscheck`
4. **Public** auswählen (Pflicht für kostenloses GitHub Pages)
5. **„Add a README file"** NICHT anhaken (wir haben schon eine)
6. Auf **„Create repository"** klicken

### 2. Dateien hochladen

**Ohne Git-Kenntnisse (einfachster Weg):**

1. Im neu erstellten Repository auf **„uploading an existing file"** klicken
   (Link erscheint direkt auf der leeren Repo-Seite)
2. Alle Dateien und den `icons`-Ordner per Drag & Drop hineinziehen
   - `index.html`, `manifest.json`, `sw.js`, `README.md`
   - den ganzen `icons`-Ordner mit den beiden PNGs
3. Unten bei **„Commit changes"** auf **„Commit changes"** klicken

**Mit Git (falls du das bevorzugst):**

```bash
cd lueftungscheck
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/DEIN-NAME/lueftungscheck.git
git push -u origin main
```

### 3. GitHub Pages aktivieren

1. Im Repository oben auf **„Settings"** klicken
2. Im linken Menü auf **„Pages"** klicken
3. Unter **„Build and deployment"** → **„Source"** → **„Deploy from a branch"** wählen
4. Branch: **„main"**, Ordner: **„/ (root)"** auswählen
5. Auf **„Save"** klicken

### 4. Warten und URL öffnen

- Das Deployment dauert meist **1–2 Minuten**
- Danach erscheint oben auf der Pages-Einstellungsseite ein grüner Kasten
  mit deiner Live-URL, typischerweise:
  ```
  https://DEIN-NAME.github.io/lueftungscheck/
  ```
- Diese URL kannst du direkt auf dem Android-Handy öffnen

### 5. Auf dem Handy installieren

**Android (Chrome):**
1. URL öffnen
2. Chrome zeigt automatisch einen Banner **„Zum Startbildschirm hinzufügen"**
   oder: Menü (⋮) → **„App installieren"**

**iPhone (Safari):**
1. URL öffnen
2. Teilen-Symbol (□ mit Pfeil) tippen
3. **„Zum Home-Bildschirm"** wählen

---

## Änderungen später hochladen

Für kleine Textänderungen ohne Git:
1. Im Repository die entsprechende Datei anklicken (z. B. `index.html`)
2. Stift-Symbol (✏️) oben rechts klicken → bearbeiten
3. Unten **„Commit changes"** klicken

GitHub Pages aktualisiert die Live-Version automatisch innerhalb von ca. 1 Minute.

---

## Monetarisierung

### Buy Me a Coffee
Bereits eingebaut mit Link zu `buymeacoffee.com/goetzpil` – kein weiteres Setup nötig.

### Falls du später AdSense/Affiliate ergänzen willst
Aktuell ist nichts davon in der App enthalten (bewusst entfernt). Bei Bedarf
kann das wieder ergänzt werden.

---

## Lokale Entwicklung / Testen vor dem Hochladen

```bash
# Einfachster lokaler Server (Python, bereits vorinstalliert auf den meisten Systemen)
cd lueftungscheck
python3 -m http.server 8080
```

Dann im Browser: `http://localhost:8080`

> ⚠️ Service Worker funktionieren **nur** über `https://` oder `localhost`,
> nicht über direktes Öffnen der Datei (`file://`). Zum Testen der
> Offline-Fähigkeit lokal daher immer über den Server öffnen, nicht die
> Datei doppelklicken.

---

## Technologie

- **Wetterdaten**: [Open-Meteo](https://open-meteo.com) – kostenlos, kein API-Key
- **Geocoding**: [Nominatim / OpenStreetMap](https://nominatim.org) – kostenlos, kein API-Key
- **Physik**: Magnus-Formel für absolute Feuchte und Taupunkt
- **Offline**: Service Worker mit Cache-First (App-Shell) / Network-First (Wetterdaten) Strategie
- **Hosting**: GitHub Pages (kostenlos für öffentliche Repositories)
