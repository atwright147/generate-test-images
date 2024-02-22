import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import randomColor from 'randomcolor';

// ×

const sizes = [
  [4608, 2592],
  [6000, 4000],
  [7360, 4912],
  [7952, 5304],
  [8688, 5792],
];

fs.mkdirSync('images', { recursive: true });

let index = 1;

for (const size of [...sizes, ...sizes]) {
  // Generate a random HSL background color
  const bgColor = randomColor({
    format: 'hsl', // Generate color in HSL format
    luminosity: 'light', // Ensure the color is light enough for text readability
  });

  let orientation = 'L';
  let [width, height] = size;
  if (index > sizes.length) {
    orientation = 'P';
    [width, height] = [height, width];
  }
  const indexString = `${orientation}${String(index).padStart(2, '0')}`;

  // Calculate font sizes based on the image dimensions
  const fontSize1 = Math.min(width, height) * 0.18;
  const fontSize2 = fontSize1 * 0.67;

  // Create a new image with the specified dimensions and background color
  sharp({
    create: {
      width: width,
      height: height,
      channels: 3,
      background: bgColor,
    }
  })
  // Composite the image with text displaying its dimensions
  .composite([{
    input: Buffer.from(`
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
        <text x="50%" y="43%" dominant-baseline="middle" text-anchor="middle" fill="ashgray" font-family="Rockwell" font-size="${fontSize1}">
          ${indexString}
        </text>
        <text x="50%" y="57%" dominant-baseline="middle" text-anchor="middle" fill="ashgray" font-family="Rockwell" font-size="${fontSize2}">
          ${width}×${height}
        </text>
      </svg>`
    ),
    gravity: 'center',
  }])
  // Save the final image
  .toFile(path.join('images', `${indexString}-${width}x${height}.png`), (err, info) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Image generated:', info);
    }
  });

  index += 1;
}
