
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

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png'];
const VIDEO_EXTENSIONS = ['.mp4', '.mov', '.avi', '.m4v'];

const TARGET_FOLDERS = [
    'media/editorial/women_day_roundup',
    'media/editorial/womens_day_playlist',
    'media/social/april fools',
    'media/social/nanku_universe'
];

async function processTargetFolders() {
    for (const folder of TARGET_FOLDERS) {
        const fullPath = path.join(__dirname, folder);
        if (fs.existsSync(fullPath)) {
            console.log(`\n--- Processing Folder: ${folder} ---`);
            await processDirectory(fullPath);
            // Cleanup double extensions
            cleanupDoubleExtensions(fullPath);
        } else {
            console.error(`Folder not found: ${fullPath}`);
        }
    }
}

function cleanupDoubleExtensions(directory) {
    const files = fs.readdirSync(directory);
    for (const file of files) {
        if (file.toLowerCase().endsWith('.jpg.webp') || file.toLowerCase().endsWith('.png.webp') || file.toLowerCase().endsWith('.jpeg.webp')) {
            const fullPath = path.join(directory, file);
            console.log(`Cleaning up double extension: ${fullPath}`);
            fs.unlinkSync(fullPath);
        }
    }
}

async function processDirectory(directory) {
    const files = fs.readdirSync(directory);

    for (const file of files) {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            await processDirectory(fullPath);
        } else {
            const ext = path.extname(file);
            const basename = path.basename(file, ext);
            const lowerExt = ext.toLowerCase();

            // Skip WebP files to avoid re-processing outputs
            if (lowerExt === '.webp') continue;
            // Skip optimized videos to avoid loops
            if (file.includes('_optimized')) continue;

            if (IMAGE_EXTENSIONS.includes(lowerExt)) {
                await optimizeImage(fullPath, directory, basename);
            } else if (VIDEO_EXTENSIONS.includes(lowerExt)) {
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
        // If it exists, we still want to delete the original if it's there
        if (fs.existsSync(filePath)) {
            console.log(`Deleting original image (optimized version already exists): ${filePath}`);
            setTimeout(() => fs.unlinkSync(filePath), 100);
        }
        return;
    }

    console.log(`Optimizing Image: ${filePath}`);

    try {
        await sharp(filePath)
            .rotate()
            .resize({ width: 1920, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(outputPath);
        console.log(`Saved: ${outputPath}`);
        
        // Delete original after success (with small delay for Windows)
        console.log(`Deleting original image: ${filePath}`);
        setTimeout(() => {
            try {
                fs.unlinkSync(filePath);
            } catch (err) {
                console.error(`Failed to delete ${filePath}:`, err.message);
            }
        }, 500);
    } catch (err) {
        console.error(`Error optimizing image ${filePath}:`, err);
    }
}

function optimizeVideo(filePath, directory, basename) {
    return new Promise((resolve, reject) => {
        let outputName = `${basename}_optimized.mp4`;
        let outputPath = path.join(directory, outputName);

        if (fs.existsSync(outputPath)) {
            console.log(`Skipping existing video: ${outputPath}`);
            // If it exists, delete original
            if (fs.existsSync(filePath)) {
                console.log(`Deleting original video (optimized version already exists): ${filePath}`);
                fs.unlinkSync(filePath);
            }
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
                // Delete original after success
                console.log(`Deleting original video: ${filePath}`);
                setTimeout(() => {
                    try {
                        fs.unlinkSync(filePath);
                    } catch (err) {
                        console.error(`Failed to delete video ${filePath}:`, err.message);
                    }
                }, 500);
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
processTargetFolders()
    .then(() => console.log('\nAll done!'))
    .catch(err => console.error('Fatal error:', err));
