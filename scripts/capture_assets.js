const fs = require('fs');
const path = require('path');

async function main() {
  const cdpPort = 9222;
  const htmlPath = path.resolve(__dirname, 'generate_screens.html');
  const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
  const outputDir = path.resolve(__dirname, '../docs/images');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`Connecting to Chrome on port ${cdpPort}...`);
  const target = await fetch(`http://127.0.0.1:${cdpPort}/json/new?${encodeURIComponent(fileUrl)}`, {
    method: 'PUT'
  }).then(r => r.json());

  console.log('Opened target:', target.id);
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

  await send('Page.enable');
  await send('DOM.enable');
  await send('CSS.enable');

  // Set device scale factor to 2 for crisp, ultra-high resolution screenshots
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1400,
    height: 3600,
    deviceScaleFactor: 2,
    mobile: false
  });

  // Give web fonts a second to load cleanly
  await new Promise(r => setTimeout(r, 1800));

  async function captureElement(selector, outputFile) {
    console.log(`Capturing ${selector} to ${path.basename(outputFile)}...`);
    const doc = await send('DOM.getDocument');
    const node = await send('DOM.querySelector', {
      nodeId: doc.root.nodeId,
      selector: selector
    });

    if (!node.nodeId) {
      throw new Error(`Element ${selector} not found`);
    }

    const box = await send('DOM.getBoxModel', { nodeId: node.nodeId });
    const quad = box.model.border;
    // quad is [x1, y1, x2, y2, x3, y3, x4, y4]
    const x = Math.min(quad[0], quad[6]);
    const y = Math.min(quad[1], quad[3]);
    const width = Math.max(quad[2], quad[4]) - x;
    const height = Math.max(quad[5], quad[7]) - y;

    const screenshot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: {
        x: x,
        y: y,
        width: width,
        height: height,
        scale: 1
      }
    });

    const buffer = Buffer.from(screenshot.data, 'base64');
    fs.writeFileSync(outputFile, buffer);
    console.log(`✓ Saved ${path.basename(outputFile)} (${Math.round(buffer.length / 1024)} KB)`);
  }

  // 1. Audio Listening & Capture
  await captureElement('#shot-listening', path.join(outputDir, '01_audio_listening.png'));

  // 2. Bio-Score Classification
  await captureElement('#shot-bioscore', path.join(outputDir, '02_bioscore_classification.png'));

  // 3. AMOLED Blackout Lock Screen
  await captureElement('#shot-blackout', path.join(outputDir, '03_blackout_lockscreen.png'));

  // 4. Panoramic 3-Step Workflow Banner
  await captureElement('#shot-panoramic', path.join(outputDir, 'auraflora_flow_showcase.png'));

  // Close target
  ws.close();
  await fetch(`http://127.0.0.1:${cdpPort}/json/close/${target.id}`);
  console.log('All screenshots captured successfully!');
}

main().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
