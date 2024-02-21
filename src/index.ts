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

for (const size of sizes) {
  // Generate a random HSL background color
  const bgColor = randomColor({
    format: 'hsl', // Generate color in HSL format
    luminosity: 'light', // Ensure the color is light enough for text readability
  });

  const [width, height] = size;

  // Create a new image with the specified dimensions and background color
  sharp({
    create: {
      width: width,
      height: height,
      channels: 4, // RGBA channels
      background: bgColor,
    }
  })
  // Composite the image with text displaying its dimensions
  .composite([{
    input: Buffer.from(`
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
        <text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" fill="ashgray" font-family="Arial" font-size="72">
          ${index}
        </text>
        <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="ashgray" font-family="Arial" font-size="48">
          ${width}×${height}
        </text>
      </svg>`
    ),
    gravity: 'center',
  }])
  // Save the final image
  .toFile(path.join('images', `image-${width}x${height}.png`), (err, info) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Image generated:', info);
    }
  });

  index += 1;
}
