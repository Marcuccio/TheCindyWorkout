# Cindy Workout Tracker

A static, local-first Cindy workout timer with voice round control, local music, and performance tracking.

## Privacy

Workout history and preferences are stored only in browser `localStorage`. The application has no backend, account system, analytics, or advertising. See `privacy.html` for the microphone caveat and full details.

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
