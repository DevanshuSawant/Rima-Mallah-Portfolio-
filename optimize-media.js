
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegPath);

const MEDIA_DIR = path.join(__dirname, 'media');

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png'];
const VIDEO_EXTENSIONS = ['.mp4', '.mov', '.avi', '.m4v'];

async function processDirectory(directory) {
    const files = fs.readdirSync(directory);

    for (const file of files) {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            await processDirectory(fullPath);
        } else {
            const ext = path.extname(file).toLowerCase();
            const basename = path.basename(file, ext);

            // Skip WebP files to avoid re-processing outputs
            if (ext === '.webp') continue;
            // Skip optimized videos to avoid loops
            if (file.includes('_optimized')) continue;

            if (IMAGE_EXTENSIONS.includes(ext)) {
                await optimizeImage(fullPath, directory, basename);
            } else if (VIDEO_EXTENSIONS.includes(ext)) {
                await optimizeVideo(fullPath, directory, basename);
            }
        }
    }
}

async function optimizeImage(filePath, directory, basename) {
    const outputPath = path.join(directory, `${basename}.webp`);

    // Check if output exists to skip
    if (fs.existsSync(outputPath)) {
        console.log(`Skipping existing: ${outputPath}`);
        return;
    }

    console.log(`Optimizing Image (with rotation fix): ${filePath}`);

    try {
        await sharp(filePath)
            .rotate() // Auto-rotate based on EXIF orientation
            // Resize if width is larger than 1920, keeping aspect ratio
            .resize({ width: 1920, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(outputPath);
        console.log(`Saved: ${outputPath}`);
    } catch (err) {
        console.error(`Error optimizing image ${filePath}:`, err);
    }
}

function optimizeVideo(filePath, directory, basename) {
    return new Promise((resolve, reject) => {
        let outputName = `${basename}.mp4`;
        let outputPath = path.join(directory, outputName);

        if (filePath === outputPath) {
            outputName = `${basename}_optimized.mp4`;
            outputPath = path.join(directory, outputName);
        }

        if (fs.existsSync(outputPath)) {
            console.log(`Skipping existing video: ${outputPath}`);
            resolve();
            return;
        }

        console.log(`Optimizing Video: ${filePath} -> ${outputName}`);

        ffmpeg(filePath)
            .outputOptions([
                '-c:v libx264',
                '-crf 23',
                '-preset medium',
                '-c:a aac',
                '-b:a 128k',
                '-movflags +faststart',
                '-vf scale=\'min(1920,iw):-2\''
            ])
            .save(outputPath)
            .on('end', () => {
                console.log(`Saved: ${outputPath}`);
                resolve();
            })
            .on('error', (err) => {
                console.error(`Error optimizing video ${filePath}:`, err);
                reject(err);
            });
    });
}

// Start processing
console.log('Starting media optimization...');
processDirectory(MEDIA_DIR)
    .then(() => console.log('All done!'))
    .catch(err => console.error('Fatal error:', err));
