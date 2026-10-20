const fs = require('fs');
const path = require('path');
const qrcode = require('qrcode');
const { PNG } = require('pngjs');
const jsQR = require('jsqr');
const { execSync } = require('child_process');

async function generateSeamlessHeartQR() {
  const url = 'https://20-10-silk.vercel.app';
  const qr = qrcode.create(url, { errorCorrectionLevel: 'H' });
  const N = qr.modules.size; // 33
  const modSize = 16;
  const qrSize = N * modSize;
  const total = 1200;
  const cx = total / 2;
  const cy = total / 2 + 65; // offset down so heart visual center is vertically balanced
  const R = (N - 1) / 2;
  
  let rects = '';
  
  // 1. Real QR modules
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (qr.modules.get(r, c)) {
        const x = (c - N/2 + 0.5) * modSize;
        const y = (r - N/2 + 0.5) * modSize;
        rects += `<rect x="${x - modSize/2}" y="${y - modSize/2}" width="${modSize + 0.3}" height="${modSize + 0.3}" fill="#db2777" />\n`;
      }
    }
  }
  
  // 2. Dummy modules in the two upper lobes to form a seamless heart
  const seed = 98765;
  function pseudoRand(r, c) {
    let h = (r * 374761393 + c * 668265263 + seed) ^ 0x5bf03635;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }
  
  // Buffer rule: Keep 1-module quiet zone around the 3 finder pattern eyes (7x7) so scanners detect them 100%
  function isNearFP(r, c, buffer = 1) {
    // FP1 at top: (0..6, 0..6)
    if (r >= -buffer && r <= 6 + buffer && c >= -buffer && c <= 6 + buffer) return true;
    // FP2 at right: (0..6, 26..32)
    if (r >= -buffer && r <= 6 + buffer && c >= 26 - buffer && c <= 32 + buffer) return true;
    // FP3 at left: (26..32, 0..6)
    if (r >= 26 - buffer && r <= 32 + buffer && c >= -buffer && c <= 6 + buffer) return true;
    return false;
  }
  
  let dummyCount = 0;
  
  // Lobe 1: above row 0 (r < 0, 0 <= c < N)
  for (let r = -Math.ceil(R); r < 0; r++) {
    for (let c = 0; c < N; c++) {
      const distSq = (r * r) + Math.pow(c - R, 2);
      if (distSq <= R * R) {
        if (isNearFP(r, c, 1)) continue;
        if (pseudoRand(r, c) > 0.48) {
          const x = (c - N/2 + 0.5) * modSize;
          const y = (r - N/2 + 0.5) * modSize;
          rects += `<rect x="${x - modSize/2}" y="${y - modSize/2}" width="${modSize + 0.3}" height="${modSize + 0.3}" fill="#db2777" />\n`;
          dummyCount++;
        }
      }
    }
  }
  
  // Lobe 2: left of col 0 (c < 0, 0 <= r < N)
  for (let r = 0; r < N; r++) {
    for (let c = -Math.ceil(R); c < 0; c++) {
      const distSq = Math.pow(r - R, 2) + (c * c);
      if (distSq <= R * R) {
        if (isNearFP(r, c, 1)) continue;
        if (pseudoRand(r, c) > 0.48) {
          const x = (c - N/2 + 0.5) * modSize;
          const y = (r - N/2 + 0.5) * modSize;
          rects += `<rect x="${x - modSize/2}" y="${y - modSize/2}" width="${modSize + 0.3}" height="${modSize + 0.3}" fill="#db2777" />\n`;
          dummyCount++;
        }
      }
    }
  }
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${total}" height="${total}" viewBox="0 0 ${total} ${total}">
  <rect width="${total}" height="${total}" fill="#ffffff" />
  <g transform="translate(${cx}, ${cy}) rotate(45)">
    ${rects}
  </g>
</svg>`;
  
  const outSvg = 'E:/Workspace/20-10/heart_qr_code.svg';
  const outPng = 'E:/Workspace/20-10/heart_qr_code.png';
  const htmlPath = 'E:/Workspace/20-10/render_heart_qr.html';
  
  fs.writeFileSync(outSvg, svg);
  fs.writeFileSync(htmlPath, `<!DOCTYPE html><html><body style="margin:0;background:#fff;display:flex;align-items:center;justify-content:center;"><img src="heart_qr_code.svg" width="${total}" height="${total}"></body></html>`);
  
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  execSync(`"${edgePath}" --headless=new --screenshot="${outPng}" --window-size=${total},${total} "file:///${htmlPath}"`);
  
  // Clean up temp html
  if (fs.existsSync(htmlPath)) fs.unlinkSync(htmlPath);
  
  // Verify with jsQR
  const data = fs.readFileSync(outPng);
  const png = PNG.sync.read(data);
  const code = jsQR(Uint8ClampedArray.from(png.data), png.width, png.height);
  
  console.log('--- HEART QR GENERATION REPORT ---');
  console.log('Modules size:', N, 'x', N);
  console.log('Dummy points generated:', dummyCount);
  console.log('Output SVG:', outSvg);
  console.log('Output PNG:', outPng, `(${png.width}x${png.height})`);
  console.log('Scan verification:', code ? `SUCCESS (${code.data})` : 'FAILED');
  
  // Copy to artifact directory
  const artifactDir = 'C:\\Users\\ACER\\.gemini\\antigravity-ide\\brain\\9d0e7254-c4d0-47c4-8d9e-cd4491603195';
  if (fs.existsSync(artifactDir)) {
    fs.copyFileSync(outPng, path.join(artifactDir, 'heart_qr_code.png'));
    console.log('Copied to artifact directory:', path.join(artifactDir, 'heart_qr_code.png'));
  }
}

generateSeamlessHeartQR();
