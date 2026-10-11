const fs = require('fs');
const path = require('path');

async function main() {
  const { GIFEncoder, quantize, applyPalette } = (await import('../frontend/node_modules/gifenc/dist/gifenc.js')).default;
  const cdpPort = 9222;

  const img1B64 = fs.readFileSync(path.resolve(__dirname, '../docs/images/01_audio_listening.png')).toString('base64');
  const img2B64 = fs.readFileSync(path.resolve(__dirname, '../docs/images/02_bioscore_classification.png')).toString('base64');
  const img3B64 = fs.readFileSync(path.resolve(__dirname, '../docs/images/03_blackout_lockscreen.png')).toString('base64');

  console.log('Connecting to Chrome CDP...');
  const target = await fetch(`http://127.0.0.1:${cdpPort}/json/new?about:blank`, { method: 'PUT' }).then(r => r.json());
  const ws = new WebSocket(target.webSocketDebuggerUrl);

  await new Promise((res, rej) => {
    ws.onopen = res;
    ws.onerror = rej;
  });

  let messageId = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const curId = messageId++;
    const handler = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === curId) {
        ws.removeEventListener('message', handler);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: curId, method, params }));
  });

  await send('Runtime.enable');

  const width = 340;
  const height = 660;

  async function getRgba(b64) {
    const expr = `
      (async () => {
        const img = new Image();
        img.src = 'data:image/png;base64,${b64}';
        await img.decode();
        const canvas = document.createElement('canvas');
        canvas.width = ${width};
        canvas.height = ${height};
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, ${width}, ${height});
        const imgData = ctx.getImageData(0, 0, ${width}, ${height});
        let bin = '';
        const d = imgData.data;
        for (let i = 0; i < d.length; i++) {
          bin += String.fromCharCode(d[i]);
        }
        return btoa(bin);
      })()
    `;
    const res = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
    if (res.exceptionDetails) {
      throw new Error(JSON.stringify(res.exceptionDetails));
    }
    return Buffer.from(res.result.value, 'base64');
  }

  console.log('Decoding frame 1 (Listening)...');
  const rgba1 = await getRgba(img1B64);

  console.log('Decoding frame 2 (Classification)...');
  const rgba2 = await getRgba(img2B64);

  console.log('Decoding frame 3 (Blackout)...');
  const rgba3 = await getRgba(img3B64);

  console.log('Encoding animated GIF with gifenc in Node...');
  const gif = GIFEncoder();

  const frames = [
    { data: new Uint8Array(rgba1), delay: 2400 },
    { data: new Uint8Array(rgba2), delay: 2600 },
    { data: new Uint8Array(rgba3), delay: 2200 }
  ];

  for (const f of frames) {
    const palette = quantize(f.data, 256);
    const index = applyPalette(f.data, palette);
    gif.writeFrame(index, width, height, { palette, delay: f.delay });
  }

  gif.finish();
  const bytes = Buffer.from(gif.bytes());
  const outputPath = path.resolve(__dirname, '../docs/images/auraflora_demo.gif');
  fs.writeFileSync(outputPath, bytes);

  console.log(`✓ Successfully generated animated GIF: docs/images/auraflora_demo.gif (${Math.round(bytes.length / 1024)} KB)`);

  ws.close();
  await fetch(`http://127.0.0.1:${cdpPort}/json/close/${target.id}`);
}

main().catch(err => {
  console.error('Error generating GIF:', err);
  process.exit(1);
});
