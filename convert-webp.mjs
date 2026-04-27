import sharp from 'sharp';
import fs from 'fs';

const files = [
  { in: 'public/favicon.jpeg', out: 'public/favicon.webp' },
  { in: 'src/assets/profile-photo.jpeg', out: 'src/assets/profile-photo.webp' }
];

async function convert() {
  for (const file of files) {
    if (fs.existsSync(file.in)) {
      await sharp(file.in).webp({ quality: 80 }).toFile(file.out);
      console.log(`Converted ${file.in} to ${file.out}`);
      // Remove original file
      fs.unlinkSync(file.in);
      console.log(`Deleted ${file.in}`);
    } else {
      console.log(`File not found: ${file.in}`);
    }
  }
}

convert();
