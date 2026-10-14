/**
 * Collector for native layout geometry.
 *
 * Run this, then open the Playground "Layout parity probe" screen in a simulator
 * or on a device — it POSTs its measurements here and the server exits.
 */
import { createServer } from 'node:http';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');
const outFile = join(repoRoot, 'artifacts/parity/native.json');
const port = 5181;

const server = createServer((req, res) => {
  if (req.method !== 'POST' || !req.url?.startsWith('/parity')) {
    res.writeHead(404).end();
    return;
  }

  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });
  req.on('end', () => {
    res.writeHead(200, { 'Content-Type': 'application/json' }).end('{"ok":true}');

    try {
      const report = JSON.parse(body);
      mkdirSync(dirname(outFile), { recursive: true });
      writeFileSync(outFile, `${JSON.stringify(report, null, 2)}\n`);
      console.log(
        `✓ native parity: ${report.measurements.length} components → artifacts/parity/native.json`,
      );
      server.close(() => process.exit(0));
    } catch (error) {
      console.error('✗ could not parse report:', error);
      server.close(() => process.exit(1));
    }
  });
});

server.listen(port, () => {
  console.log(`Waiting for the Playground parity probe on http://localhost:${port}/parity …`);
});
