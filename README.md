# Cindy Workout Tracker

A static, local-first Cindy workout timer with recorded coach cues, local music, and performance tracking.

Completed workouts are categorized using the recipe and round count. Scaled sessions reaching 8 rounds are Beginner; prescribed 5/10/15 sessions are Intermediate at 8-19 rounds, Rx'd at 20-24, and Elite at 25 or more. Results below 8 rounds are shown as Building.

## Privacy

Workout history and preferences are stored only in browser `localStorage`. The application has no backend, account system, analytics, advertising, or microphone access.

The Performance page can export this local data as JSON and import it into another browser. Imported files are validated and merged locally without upload.

On supported smartphones, the app suggests adding Cindy to the home screen. Android uses the native install prompt when available; iPhone displays the Share > Add to Home Screen instructions. Dismissing the suggestion hides it for 14 days.

Recorded coach cues are stored as individual MP3 files in `voice/` and are used for fixed announcements. Dynamic round numbers, recipes, and final scores use browser speech synthesis. `voice/manifest.json` documents every source timestamp and exported clip.

## Keyboard shortcuts

- `Space`: complete round
- `P`: pause
- `R`: resume
- `S`: start
- `M`: mute or unmute music
- `N`: next music track
- `F`: enter or exit fullscreen
- `?`: open the shortcuts guide

Fullscreen uses the browser Fullscreen API on supported desktop and Android browsers. iPhone Safari does not allow arbitrary page fullscreen; installing the PWA to the Home Screen provides the equivalent standalone experience.

## Screen standby

The app requests a Screen Wake Lock while a workout is running, releases it while paused, and reacquires it when the page becomes visible again. This keeps the controls available on supported mobile browsers. If the browser suspends the page anyway, the countdown is recalculated from the real clock when the app returns.

## Run locally

```bash
python3 -m http.server 51015
```

Open `http://localhost:51015`.

## Deploy to GitHub Pages

This directory is ready to be used as a standalone GitHub repository.

1. Create an empty GitHub repository.
2. Push this directory to its `main` or `master` branch.
3. In **Settings > Pages**, select **GitHub Actions** as the source.
4. The included `.github/workflows/deploy-pages.yml` workflow deploys the static app.

All application URLs are relative, so project Pages URLs such as `https://USER.github.io/REPOSITORY/` work without configuration.
