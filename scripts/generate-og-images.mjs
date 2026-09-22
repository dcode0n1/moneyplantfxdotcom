import fs from 'fs';
import path from 'path';
import { chromium } from '@playwright/test';
import sharp from 'sharp';

const publicDir = 'C:\\9xTech\\9xtechnologydotcom\\public';

function getBase64FromBuffer(buf, mime = 'image/png') {
  return `data:${mime};base64,${buf.toString('base64')}`;
}

function getBase64FromFile(filePath) {
  const buf = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const mime = ext === '.png' ? 'image/png' : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
  return getBase64FromBuffer(buf, mime);
}

// 1. Prepare Maria studio portrait (cut out stark white background & composite with luxury dark ambience)
async function prepareMariaStudioPortrait() {
  const mariaInput = path.join(publicDir, 'img', 'mariia-moroz.jpg');
  const { data, info } = await sharp(mariaInput).raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const alpha = new Uint8Array(w * h).fill(255);

  const queue = [];
  const visited = new Uint8Array(w * h);

  function isWhite(x, y) {
    const idx = (y * w + x) * 3;
    return data[idx] > 232 && data[idx + 1] > 232 && data[idx + 2] > 232;
  }

  for (let x = 0; x < w; x++) {
    if (isWhite(x, 0)) { queue.push(x, 0); visited[0 * w + x] = 1; }
    if (isWhite(x, h - 1)) { queue.push(x, h - 1); visited[(h - 1) * w + x] = 1; }
  }
  for (let y = 0; y < h; y++) {
    if (isWhite(0, y)) { queue.push(0, y); visited[y * w + 0] = 1; }
    if (isWhite(w - 1, y)) { queue.push(w - 1, y); visited[y * w + (w - 1)] = 1; }
  }

  let head = 0;
  while (head < queue.length) {
    const x = queue[head++];
    const y = queue[head++];
    alpha[y * w + x] = 0;

    const neighbors = [
      [x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]
    ];
    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
        const nidx = ny * w + nx;
        if (!visited[nidx] && isWhite(nx, ny)) {
          visited[nidx] = 1;
          queue.push(nx, ny);
        }
      }
    }
  }

  const rgba = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const srcIdx = (y * w + x) * 3;
      const dstIdx = (y * w + x) * 4;
      rgba[dstIdx] = data[srcIdx];
      rgba[dstIdx + 1] = data[srcIdx + 1];
      rgba[dstIdx + 2] = data[srcIdx + 2];

      let a = alpha[y * w + x];
      if (a === 255) {
        let nearCount = 0;
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            const px = x + dx;
            const py = y + dy;
            if (px >= 0 && px < w && py >= 0 && py < h) {
              if (alpha[py * w + px] === 0) nearCount++;
            }
          }
        }
        if (nearCount > 0) {
          a = Math.max(0, 255 - nearCount * 12);
        }
      }
      rgba[dstIdx + 3] = a;
    }
  }

  const mariaFg = await sharp(rgba, { raw: { width: w, height: h, channels: 4 } })
    .png()
    .toBuffer();

  const bgSvg = `
    <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="warmStudio" cx="72%" cy="32%" r="65%">
          <stop offset="0%" stop-color="#4a3b2c" stop-opacity="0.8"/>
          <stop offset="35%" stop-color="#242c40" stop-opacity="0.95"/>
          <stop offset="100%" stop-color="#0b1222" stop-opacity="1.0"/>
        </radialGradient>
        <radialGradient id="coolAccent" cx="15%" cy="85%" r="50%">
          <stop offset="0%" stop-color="#19335a" stop-opacity="0.5"/>
          <stop offset="100%" stop-color="#0b1222" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#warmStudio)"/>
      <rect width="${w}" height="${h}" fill="url(#coolAccent)"/>
    </svg>
  `;

  const bgBuf = await sharp(Buffer.from(bgSvg)).png().toBuffer();

  return sharp(bgBuf)
    .composite([{ input: mariaFg, top: 0, left: 0 }])
    .png()
    .toBuffer();
}

const logoBase64 = getBase64FromFile(path.join(publicDir, 'MoneyplantFX', 'android-chrome-192x192.png'));
const harshPhotoBase64 = getBase64FromFile(path.join(publicDir, 'img', 'harsh-agarwal.png'));

function generateHtml(cfg) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${cfg.name} OG Image</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      width: 1200px;
      height: 630px;
      overflow: hidden;
      background-color: #070d1a;
      font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
      position: relative;
      color: #ffffff;
      -webkit-font-smoothing: antialiased;
    }

    /* Ambient Background lighting & technical grid */
    .bg-canvas {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at 965px 308px, rgba(30, 95, 205, 0.45) 0%, rgba(14, 50, 120, 0.22) 38%, rgba(7, 13, 26, 0) 68%),
        radial-gradient(circle at 120px 110px, rgba(25, 80, 180, 0.24) 0%, rgba(7, 13, 26, 0) 55%),
        linear-gradient(135deg, #070d1a 0%, #091224 50%, #0c1830 100%);
    }

    .bg-grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(56, 189, 248, 0.035) 1px, transparent 1px),
        linear-gradient(90deg, rgba(56, 189, 248, 0.035) 1px, transparent 1px);
      background-size: 50px 50px;
      opacity: 0.85;
    }

    /* Top Left Branding */
    .brand-header {
      position: absolute;
      top: 72px;
      left: 80px;
      display: flex;
      align-items: center;
      gap: 20px;
      z-index: 10;
    }

    .brand-logo-card {
      width: 80px;
      height: 80px;
      border-radius: 18px;
      background: #0060b2;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
      border: 1px solid rgba(255, 255, 255, 0.12);
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .brand-logo-card img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .brand-text-col {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .brand-name {
      font-size: 34px;
      font-weight: 700;
      letter-spacing: -0.02em;
      line-height: 1.1;
      color: #ffffff;
    }

    .brand-tagline {
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: #60a5fa;
      margin-top: 5px;
    }

    /* Left Executive Card */
    .executive-card {
      position: absolute;
      top: 196px;
      left: 80px;
      width: 580px;
      height: 236px;
      border-radius: 24px;
      background: rgba(13, 23, 44, 0.72);
      border: 1px solid rgba(56, 189, 248, 0.16);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(16px);
      padding: 36px 42px;
      z-index: 10;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .card-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: #f97316;
    }

    .executive-name {
      font-size: 44px;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: #ffffff;
      margin-top: 12px;
      line-height: 1.05;
    }

    .executive-role {
      font-size: 25px;
      font-weight: 600;
      letter-spacing: -0.01em;
      color: #38bdf8;
      margin-top: 10px;
      line-height: 1.2;
    }

    .executive-org {
      font-size: 19px;
      font-weight: 400;
      color: #94a3b8;
      margin-top: 6px;
      line-height: 1;
    }

    /* Right Avatar Section */
    .avatar-outer-ring {
      position: absolute;
      left: 811px;
      top: 151px;
      width: 312px;
      height: 312px;
      border-radius: 50%;
      border: 3.5px solid #2563eb;
      box-shadow: 0 0 24px rgba(37, 99, 235, 0.5), inset 0 0 16px rgba(37, 99, 235, 0.25);
      z-index: 5;
    }

    .avatar-inner-circle {
      position: absolute;
      left: 825px;
      top: 165px;
      width: 284px;
      height: 284px;
      border-radius: 50%;
      overflow: hidden;
      background: #070e1c;
      z-index: 6;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
    }

    .avatar-inner-circle img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: ${cfg.photoPosition};
      transform: scale(${cfg.photoScale});
    }

    .orbital-orb {
      position: absolute;
      left: 1058px;
      top: 396px;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, #ffffff 0%, #38bdf8 55%, #0284c7 100%);
      box-shadow: 0 0 10px #38bdf8, 0 0 20px rgba(56, 189, 248, 0.85);
      border: 2.5px solid #070d1a;
      z-index: 8;
    }

    .under-avatar-pill {
      position: absolute;
      left: 792px;
      top: 502px;
      width: 350px;
      height: 42px;
      border-radius: 21px;
      background: rgba(13, 23, 46, 0.82);
      border: 1px solid rgba(56, 189, 248, 0.16);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12.5px;
      font-weight: 600;
      color: #94a3b8;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      z-index: 10;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    }

    /* Footer */
    .footer-bar {
      position: absolute;
      bottom: 28px;
      left: 80px;
      right: 80px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 10;
    }

    .footer-text {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      font-weight: 500;
      color: #475569;
      letter-spacing: 0.18em;
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <div class="bg-canvas"></div>
  <div class="bg-grid"></div>

  <!-- Top-Left Branding -->
  <div class="brand-header">
    <div class="brand-logo-card">
      <img src="${logoBase64}" alt="MoneyplantFX Logo" />
    </div>
    <div class="brand-text-col">
      <div class="brand-name">MoneyplantFX</div>
      <div class="brand-tagline">ZERO BROKERAGE • CMA 1 &amp; 5 COMPLIANT</div>
    </div>
  </div>

  <!-- Left Executive Hub Card -->
  <div class="executive-card">
    <div class="card-tag">${cfg.tag}</div>
    <div class="executive-name">${cfg.name}</div>
    <div class="executive-role">${cfg.role}</div>
    <div class="executive-org">${cfg.org}</div>
  </div>

  <!-- Right Profile Avatar & Telemetry Node -->
  <div class="avatar-outer-ring"></div>
  <div class="avatar-inner-circle">
    <img src="${cfg.photoBase64}" alt="${cfg.name}" />
  </div>
  <div class="orbital-orb"></div>
  <div class="under-avatar-pill">${cfg.bottomPill}</div>

  <!-- Footer -->
  <div class="footer-bar">
    <div class="footer-text">${cfg.footerLeft}</div>
    <div class="footer-text">${cfg.footerRight}</div>
  </div>
</body>
</html>`;
}

async function run() {
  console.log('Preparing Maria studio portrait...');
  const mariaStudioBuf = await prepareMariaStudioPortrait();
  const mariaStudioBase64 = getBase64FromBuffer(mariaStudioBuf, 'image/png');

  const configs = [
    {
      id: 'harsh',
      name: 'Harsh Agarwal',
      role: 'Chief Executive Officer',
      org: '@ MoneyplantFX',
      tag: 'DIGITAL EXECUTIVE HUB • CMA 1 & 5 COMPLIANT',
      photoBase64: harshPhotoBase64,
      photoPosition: 'center 16%',
      photoScale: '108%',
      footerLeft: '© MONEYPLANT FX • CMA 1 & 5 COMPLIANT • DUBAI EXPO 2026',
      footerRight: 'PRECISION • LIQUIDITY • EXECUTION',
      bottomPill: 'CMA 1 & 5 COMPLIANT',
      outputFilenames: ['harsh-og.png', 'moneyplantfx-harsh-og.png'],
    },
    {
      id: 'maria',
      name: 'Mariia Moroz',
      role: 'Head of Marketing',
      org: '@ MoneyplantFX',
      tag: 'DIGITAL EXECUTIVE HUB • CMA 1 & 5 COMPLIANT',
      photoBase64: mariaStudioBase64,
      photoPosition: 'center 16%',
      photoScale: '106%',
      footerLeft: '© MONEYPLANT FX • CMA 1 & 5 COMPLIANT • DUBAI EXPO 2026',
      footerRight: 'PRECISION • LIQUIDITY • EXECUTION',
      bottomPill: 'CMA 1 & 5 COMPLIANT',
      outputFilenames: ['maria-og.png', 'mariia-og.png', 'moneyplantfx-maria-og.png'],
    }
  ];

  console.log('Launching Playwright Chrome...');
  const browser = await chromium.launch({ channel: 'chrome' });
  const context = await browser.newContext({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  for (const cfg of configs) {
    console.log(`Generating OG image for ${cfg.name}...`);
    const html = generateHtml(cfg);
    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.evaluate(async () => {
      await document.fonts.ready;
    });
    await page.waitForTimeout(600);

    const screenshotBuffer = await page.screenshot({ type: 'png', omitBackground: false });

    for (const filename of cfg.outputFilenames) {
      const targetPath = path.join(publicDir, filename);
      fs.writeFileSync(targetPath, screenshotBuffer);
      console.log(`Saved: ${targetPath}`);
    }
  }

  await browser.close();
  console.log('Finished successfully!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
