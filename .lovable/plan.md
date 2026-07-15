Replace the Pitch Deck Maker card image in the marketing homepage with the uploaded front-page image, converted and sized as requested.

Steps:
1. Convert the uploaded PNG (`/mnt/user-uploads/Pitch_Deck_Maker_Front_Page.png`, 1024×1536, 2.3 MB) to WebP at quality ~82, resizing if necessary, targeting < 150 KB. Save the result as `src/assets/tool-pitch-deck-new.webp` (using cwebp/ImageMagick, whichever is available in the sandbox).
2. Update `src/pages/HomeMarketing.tsx` line 8: change the `imgPitchDeck` import from `@/assets/tool-pitch-deck-new.jpg` to `@/assets/tool-pitch-deck-new.webp`.
3. Leave the Pitch Deck `ToolCard` invocation and component untouched — it already passes `aspect="tall"`, and the `<img>` already has `alt=""`, `loading="lazy"`, `decoding="async"`, `object-cover`, and `flex-1`.
4. Do not modify any other card, header, footer, or route code.
5. Run `bun run build` and confirm a green exit code.

Expected result: homepage Pitch Deck Maker card renders the new front-page image in the same tall portrait bento slot, under 150 KB.