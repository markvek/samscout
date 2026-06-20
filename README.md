<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# SamScout

SamScout searches SAM.gov databases and looks to discover the best government contracts that are most aligned with any given entity.

This repository contains everything you need to run the application locally.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
3. Run the application:
   ```bash
   npm run dev
   ```
