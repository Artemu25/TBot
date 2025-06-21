"""Entry point for the echo Telegram bot."""
from __future__ import annotations

import argparse
import os
from telegram import Update
from telegram.ext import (
    ApplicationBuilder,
    CommandHandler,
    MessageHandler,
    ContextTypes,
    filters,
)


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Send a welcome message when the /start command is issued."""
    await update.message.reply_text(
        "Hello! Send me something and I'll echo it back to you."
    )


async def echo(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Echo the user's message."""
    if update.message is None:
        return
    await update.message.reply_text(update.message.text)


def main(argv: list[str] | None = None) -> None:
    """Run the bot."""
    parser = argparse.ArgumentParser(description="Run the echo Telegram bot")
    parser.add_argument(
        "--token",
        help="Telegram bot token (can also be set via BOT_TOKEN env var)",
    )
    args = parser.parse_args(argv)

    token = args.token or os.getenv("BOT_TOKEN")
    if not token:
        raise RuntimeError("BOT_TOKEN environment variable not set and --token not provided")

    application = ApplicationBuilder().token(token).build()

    application.add_handler(CommandHandler("start", start))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, echo))

    application.run_polling()


if __name__ == "__main__":
    main()
