
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

    if (fs.existsSync(outputPath)) {
        console.log(`Skipping existing: ${outputPath}`);
        return;
    }

    console.log(`Optimizing Image: ${filePath}`);

    try {
        await sharp(filePath)
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
        // For video, we might want to keep the original extension if it's already mp4, 
        // but to ensure it's optimized, we'll write to a temp file then rename, 
        // OR write to a new 'optimized.mp4' name. 
        // The prompt asked for "web optimised versions".
        
        // If it's already .mp4, we need to be careful not to overwrite source while reading
        // unless we use a temp file.
        // Let's adopt a naming convention: name_optimized.mp4 if source is mp4, 
        // or just name.mp4 if source is NOT mp4 (e.g. .mov).
        
        // Actually, for simplicity and safety: naming it `filename.mp4` might conflict if source is `filename.mp4`.
        // Ideally we want to replace the original OR have a clear new version.
        // Given the requirement "convert all... to web optimised versions", 
        // let's create `filename_optim.mp4`.
        // BUT user might want to simple replace imports. 
        
        // Let's stick to the plan: "Saves optimized files in the same directory... side-by-side"
        // If source is `foo.mov`, output `foo.mp4`.
        // If source is `foo.mp4`, output `foo_web.mp4`? 
        // Let's keep it simple: If output filename == input filename, skip or add suffix.
        
        let outputName = `${basename}.mp4`;
        let outputPath = path.join(directory, outputName);

        if (filePath === outputPath) {
            // Source is already .mp4 with same name. 
            // We should create a temporary or suffixed file.
            outputName = `${basename}_optimized.mp4`;
            outputPath = path.join(directory, outputName);
        }

        if (fs.existsSync(outputPath)) {
            console.log(`Skipping existing: ${outputPath}`);
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
                // Ensure max width 1920 (optional, but good for web)
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
