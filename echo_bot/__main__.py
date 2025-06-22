"""Entry point for the echo Telegram bot using aiogram."""

from __future__ import annotations

import argparse
import asyncio
import logging
import os
from functools import partial

from aiogram import Bot, Dispatcher, F, types
from aiogram.filters import Command
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo

logger = logging.getLogger(__name__)


async def start(message: types.Message, webapp_url: str | None = None) -> None:
    """Send a welcome message when the /start command is issued."""
    logger.info("Received /start from %s", message.from_user.id)
    if webapp_url:
        keyboard = InlineKeyboardMarkup(
            inline_keyboard=[
                [
                    InlineKeyboardButton(
                        text="Open Mini App", web_app=WebAppInfo(url=webapp_url)
                    )
                ]
            ]
        )
        await message.answer(
            "Hello! Use the button below to open the mini app.",
            reply_markup=keyboard,
        )
    else:
        await message.answer("Hello! Send me something and I'll echo it back to you.")


async def echo(message: types.Message) -> None:
    """Echo the user's message."""
    logger.info("Echoing message from %s: %s", message.from_user.id, message.text)
    await message.answer(message.text)


async def _async_main(argv: list[str] | None = None) -> None:
    """Run the bot."""
    logging.basicConfig(level=logging.INFO)
    logger.info("Starting echo bot")
    parser = argparse.ArgumentParser(description="Run the echo Telegram bot")
    parser.add_argument(
        "--token",
        help="Telegram bot token (can also be set via BOT_TOKEN env var)",
    )
    parser.add_argument(
        "--webapp-url",
        help="URL to the mini app served via GitHub Pages (or WEBAPP_URL env var)",
    )
    args = parser.parse_args(argv)

    token = args.token or os.getenv("BOT_TOKEN")
    webapp_url = args.webapp_url or os.getenv("WEBAPP_URL")
    if not token:
        logger.error("No bot token provided")
        raise RuntimeError(
            "BOT_TOKEN environment variable not set and --token not provided"
        )

    bot = Bot(token)
    dp = Dispatcher()

    dp.message(Command("start"))(partial(start, webapp_url=webapp_url))
    dp.message(F.text & ~F.command)(echo)

    await dp.start_polling(bot)


def main(argv: list[str] | None = None) -> None:
    """Entry point for the console script."""
    asyncio.run(_async_main(argv))


if __name__ == "__main__":
    main()
