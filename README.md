# Echo Bot Project

This repository contains a simple Telegram echo bot and a static page that can
be served via GitHub Pages as a mini app.

## Requirements

- Python 3.8+
- [uv](https://github.com/astral-sh/uv) package manager

## Usage

Install the project using `uv`:

```bash
uv sync
```

## Echo Telegram Bot

The bot uses [aiogram](https://github.com/aiogram/aiogram). Provide your bot
token via the `BOT_TOKEN` environment variable or the `--token` command line
flag. To link the bot with your GitHub Pages mini app, pass the page URL via
`WEBAPP_URL` or the `--webapp-url` option and run:

```bash
uv run echo-bot --token <YOUR_BOT_TOKEN> --webapp-url https://<username>.github.io/<repo>/
```

## Testing

You can verify that everything is installed correctly by running:

```bash
uv pip check
uv run echo-bot --help
timeout 5 uv run echo-bot --token invalid  # fails with TokenValidationError
timeout 5 env BOT_TOKEN=$BOT_TOKEN uv run echo-bot  # starts the bot
```

## Mini App

This repository also contains a small static page located in the `docs/` directory.
It demonstrates how to deploy a simple HTML document using **GitHub Pages**.

### Local preview

Open `docs/index.html` in your browser to test it locally.

### Deploy to GitHub Pages

Enable GitHub Pages in the repository settings and select the `docs` folder from the `main` branch as the source. After GitHub publishes the site, your mini app will be available at `https://<username>.github.io/<repo>/`.

Once the page is live, start the bot with the same URL so users can open it directly from Telegram:

```bash
env BOT_TOKEN=<YOUR_BOT_TOKEN> WEBAPP_URL=https://<username>.github.io/<repo>/ uv run echo-bot
```
