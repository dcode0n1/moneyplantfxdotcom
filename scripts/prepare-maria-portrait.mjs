import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const scratchDir = 'C:\\Users\\dcode\\.gemini\\antigravity-cli\\brain\\94555599-3688-4b96-ad71-80dee1a0e4a5\\scratch';
const mariaInput = 'C:\\9xTech\\9xtechnologydotcom\\public\\img\\mariia-moroz.jpg';

async function run() {
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

  // Create luxury studio backdrop matching Harsh's warm ambient background
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

  const finalBuf = await sharp(bgBuf)
    .composite([{ input: mariaFg, top: 0, left: 0 }])
    .png()
    .toBuffer();

  const studioPath = path.join(scratchDir, 'mariia-studio.png');
  fs.writeFileSync(studioPath, finalBuf);
  console.log('Saved studio portrait to', studioPath);
}

run().catch(console.error);
