# Telegram Bot Example

This repository contains a simple echo bot built with [aiogram](https://github.com/aiogram/aiogram).

## Requirements

- Python 3.12+
- [uv](https://github.com/astral-sh/uv) package manager

## Usage

Install the project using `uv`:

```bash
uv sync
```

## Development dependencies

The test suite depends on packages installed as uv development
dependencies. See the [uv documentation](https://docs.astral.sh/uv/concepts/projects/dependencies/#development-dependencies)
for details. These packages are included automatically when you run:

```bash
uv sync
```

## Echo Telegram Bot

This project ships a simple echo bot written with
[aiogram](https://github.com/aiogram/aiogram). Provide your bot token either via
the `BOT_TOKEN` environment variable or the `--token` command line flag. To link
the bot with your GitHub Pages mini app, pass the page URL via `WEBAPP_URL` or
the `--webapp-url` option and run:

```bash
uv run echo-bot --token <YOUR_BOT_TOKEN> --webapp-url https://<username>.github.io/<repo>/
```

## Testing

You can verify that everything is installed correctly by running:

```bash
uv pip check
uv run echo-bot --help  # optional, shows command usage
timeout 5 uv run echo-bot --token invalid  # fails with TokenValidationError
timeout 5 env BOT_TOKEN=$BOT_TOKEN uv run echo-bot  # starts the bot
uv run pytest -q tests  # run the unit tests
```

## Mini App

This repository also contains a small static page located in the `docs/` directory.
It demonstrates how to deploy a simple HTML document using **GitHub Pages**.

### Local preview

Open `docs/index.html` in your browser to test it locally. The page loads
Vue from a CDN and references `docs/script.js` for its logic. Keep
`docs/styles.css` in the same directory for styling.

### Deploy to GitHub Pages

Enable GitHub Pages in the repository settings and select the `docs` folder from the `main` branch as the source. After GitHub publishes the site, your mini app will be available at `https://<username>.github.io/<repo>/`.

Once the page is live, start the bot with the same URL so users can open it directly from Telegram:

```bash
env BOT_TOKEN=<YOUR_BOT_TOKEN> WEBAPP_URL=https://<username>.github.io/<repo>/ uv run echo-bot
```
