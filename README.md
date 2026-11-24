<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1pK-Y13pcqXEvqUGyg_Dl1r-UJuEcYDmW

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Media previews

After adding or replacing local media imports, run `npm run media:previews`.
This generates responsive WebP card images and video poster frames in
`media/previews/`, plus the `media-previews.ts` lookup. Commit these generated
files with the content changes. The original media stays available at full quality.

Cards load previews near the viewport. Video data loads only while a card is
visible, and carousels warm the next slide instead of downloading the whole set.
