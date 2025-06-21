# Hello World Project

This repository contains a minimal Python project that prints "hello world".

## Requirements

- Python 3.8+
- [uv](https://github.com/astral-sh/uv) package manager

## Usage

Install the project using `uv`:

```bash
uv sync
```

Run the hello world program using `uv`:

```bash
uv run python -m hello_world
```

## Echo Telegram Bot

This project ships a simple echo bot written with
[aiogram](https://github.com/aiogram/aiogram). Provide your bot token either via
the `BOT_TOKEN` environment variable or the `--token` command line flag and run:

```bash
uv run echo-bot --token <YOUR_BOT_TOKEN>
```

## Testing

You can verify that everything is installed correctly by running:

```bash
uv pip check
uv run echo-bot --help
timeout 5 uv run echo-bot --token invalid  # fails with TokenValidationError
timeout 5 env BOT_TOKEN=$BOT_TOKEN uv run echo-bot  # starts the bot
uv run hello-world
```
