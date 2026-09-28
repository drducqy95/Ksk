import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';

function createIcon(size, filename) {
  const png = new PNG({ width: size, height: size });
  const center = size / 2;
  const radius = size * 0.46;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (size * y + x) << 2;
      const dx = x - center;
      const dy = y - center;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background rounded circle
      if (dist <= radius) {
        // Gradient from Navy/Sky to Emerald
        const factor = (y / size);
        const r = Math.round(14 * (1 - factor) + 6 * factor);
        const g = Math.round(116 * (1 - factor) + 182 * factor);
        const b = Math.round(144 * (1 - factor) + 212 * factor);

        // Medical Cross in center
        const crossW = size * 0.22;
        const crossL = size * 0.62;
        const inVert = Math.abs(dx) <= crossW / 2 && Math.abs(dy) <= crossL / 2;
        const inHoriz = Math.abs(dy) <= crossW / 2 && Math.abs(dx) <= crossL / 2;

        if (inVert || inHoriz) {
          // White cross with slight inner shine
          png.data[idx] = 255;
          png.data[idx + 1] = 255;
          png.data[idx + 2] = 255;
          png.data[idx + 3] = 255;
        } else {
          png.data[idx] = r;
          png.data[idx + 1] = g;
          png.data[idx + 2] = b;
          png.data[idx + 3] = 255;
        }
      } else {
        // Transparent
        png.data[idx] = 0;
        png.data[idx + 1] = 0;
        png.data[idx + 2] = 0;
        png.data[idx + 3] = 0;
      }
    }
  }

  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const filePath = path.join(publicDir, filename);
  fs.writeFileSync(filePath, PNG.sync.write(png));
  console.log(`Generated ${filePath}`);
}

createIcon(192, 'pwa-192x192.png');
createIcon(512, 'pwa-512x512.png');
createIcon(64, 'favicon.ico');
