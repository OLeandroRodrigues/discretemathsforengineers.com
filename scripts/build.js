// scripts/build.js
import fs from "node:fs";
import path from "node:path";

const SRC = path.resolve("src");
const DIST = path.resolve("dist");

const SHARED = path.join(SRC, "shared");
const SHARED_PARTIALS = path.join(SHARED, "partials");
const SHARED_ASSETS = path.join(SHARED, "assets");

const LANGS = ["en", "pt"];

/* ---------- helpers ---------- */

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function cleanDist() {
  if (fs.existsSync(DIST)) {
    fs.rmSync(DIST, { recursive: true, force: true });
  }
  ensureDir(DIST);
}

function copyDir(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return;
  ensureDir(destDir);

  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) copyDir(srcPath, destPath);
    else fs.copyFileSync(srcPath, destPath);
  }
}

function looksLikeFullHtml(raw) {
  const s = raw.trim().toLowerCase();
  return s.startsWith("<!doctype html") || s.startsWith("<html");
}

/* ---------- partial loading ---------- */

function loadSharedPartials() {
  if (!fs.existsSync(SHARED_PARTIALS)) {
    throw new Error(`Shared partials folder not found: ${SHARED_PARTIALS}`);
  }

  const partials = {};
  for (const file of fs.readdirSync(SHARED_PARTIALS)) {
    if (!file.endsWith(".html")) continue;
    const key = file.replace(".html", "");
    partials[key] = fs.readFileSync(path.join(SHARED_PARTIALS, file), "utf8");
  }
  return partials;
}

function loadLangPartials(lang) {
  const langPartialsDir = path.join(SRC, lang, "partials");
  const partials = {};

  if (!fs.existsSync(langPartialsDir)) {
    throw new Error(
      `Missing partials folder for lang="${lang}". Expected: ${langPartialsDir}`
    );
  }

  for (const file of fs.readdirSync(langPartialsDir)) {
    if (!file.endsWith(".html")) continue;
    const key = file.replace(".html", "");
    partials[key] = fs.readFileSync(path.join(langPartialsDir, file), "utf8");
  }

  return partials;
}

/* ---------- template rendering ---------- */

function renderTemplate(html, partials) {
  return html.replace(/\{\{\>\s*([a-zA-Z0-9\-_]+)\s*\}\}/g, (_, name) => {
    if (!partials[name]) {
      throw new Error(`Partial not found: ${name}`);
    }
    return partials[name];
  });
}

function wrapAsFullHtml({ lang, bodyHtml, partials }) {
  const htmlLang = lang === "pt" ? "pt-BR" : "en";

  const base = `<!doctype html>
<html lang="${htmlLang}">
<head>
  <title>Discrete Maths for Engineers</title>
  {{> head}}
</head>
<body>
  {{> header}}
  <div class="app">
    {{> sidebar}}
    ${bodyHtml}
  </div>
</body>
</html>`;

  return renderTemplate(base, partials);
}

/* ---------- build per language ---------- */

function buildHtmlUnderLang(lang, sharedPartials) {
  const langSrc = path.join(SRC, lang);
  if (!fs.existsSync(langSrc)) return;

  const langPartials = loadLangPartials(lang);

  // Merge order:
  // shared < lang-specific (lang wins)
  const partials = {
    ...sharedPartials,
    ...langPartials,
  };

  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        walk(full);
        continue;
      }

      if (!entry.isFile()) continue;

      const relFromSrc = path.relative(SRC, full);
      const outPath = path.join(DIST, relFromSrc);
      ensureDir(path.dirname(outPath));

      if (entry.name.endsWith(".html")) {
        const raw = fs.readFileSync(full, "utf8");

        if (looksLikeFullHtml(raw)) {
          const rendered = renderTemplate(raw, partials);
          fs.writeFileSync(outPath, rendered, "utf8");
        } else {
          const renderedBody = renderTemplate(raw, partials);
          const wrapped = wrapAsFullHtml({
            lang,
            bodyHtml: renderedBody,
            partials,
          });
          fs.writeFileSync(outPath, wrapped, "utf8");
        }
      } else {
        fs.copyFileSync(full, outPath);
      }
    }
  };

  walk(langSrc);
}

/* ---------- root index redirect (/) ---------- */

function writeRootIndexRedirect() {
  const outFile = path.join(DIST, "index.html");

  // Notes:
  // - Works for custom domain (root = /)
  // - Preserves querystring + hash
  // - Uses location.replace so it doesn't pollute history
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta http-equiv="refresh" content="0; url=/en/" />
  <link rel="canonical" href="/en/" />
  <title>Discrete Maths for Engineers</title>
  <meta name="robots" content="noindex" />
  <script>
    (function () {
      var qs = location.search || "";
      var h = location.hash || "";
      // If user already landed in /en or /pt (some edge case), do nothing.
      if (/\\/(en|pt)(\\/|$)/.test(location.pathname)) return;
      location.replace("/en/" + qs + h);
    })();
  </script>
</head>
<body>
  <noscript>
    <p>Redirecting to <a href="/en/">/en/</a>…</p>
  </noscript>
</body>
</html>`;

  fs.writeFileSync(outFile, html, "utf8");
}

/* ---------- main ---------- */

function main() {
  cleanDist();

  const sharedPartials = loadSharedPartials();

  for (const lang of LANGS) {
    buildHtmlUnderLang(lang, sharedPartials);
  }

  copyDir(SHARED_ASSETS, path.join(DIST, "assets"));

  // Make https://discretemathsforengineers.com/ open EN by default
  writeRootIndexRedirect();

  console.log("Build complete → dist/");
}

main();
