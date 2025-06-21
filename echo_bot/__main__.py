"""Entry point for the echo Telegram bot using aiogram."""
from __future__ import annotations

import argparse
import asyncio
import logging
import os

from aiogram import Bot, Dispatcher, F, types
from aiogram.filters import Command
from functools import partial

logger = logging.getLogger(__name__)


async def start(message: types.Message) -> None:
    """Send a welcome message when the /start command is issued."""
    logger.info("Received /start from %s", message.from_user.id)
    await message.answer("Hello! Send me something and I'll echo it back to you.")


async def echo(message: types.Message) -> None:
    """Echo the user's message."""
    logger.info("Echoing message from %s: %s", message.from_user.id, message.text)
    await message.answer(message.text)


async def mini(message: types.Message, app_url: str | None) -> None:
    """Send a button that opens the mini app."""
    if not app_url:
        await message.answer("Mini app URL not configured")
        return
    keyboard = types.InlineKeyboardMarkup(
        inline_keyboard=[
            [
                types.InlineKeyboardButton(
                    text="Open Mini App", web_app=types.WebAppInfo(url=app_url)
                )
            ]
        ]
    )
    logger.info("Sending mini app button to %s", message.from_user.id)
    await message.answer("Open the mini app:", reply_markup=keyboard)


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
        "--app-url",
        help="URL where the mini app is hosted (can also be set via MINI_APP_URL)",
    )
    args = parser.parse_args(argv)

    token = args.token or os.getenv("BOT_TOKEN")
    if not token:
        logger.error("No bot token provided")
        raise RuntimeError(
            "BOT_TOKEN environment variable not set and --token not provided"
        )

    app_url = args.app_url or os.getenv("MINI_APP_URL")

    bot = Bot(token)
    dp = Dispatcher()

    dp.message(Command("start"))(start)
    dp.message(Command("mini"))(partial(mini, app_url=app_url))
    dp.message(F.text & ~F.command)(echo)

    await dp.start_polling(bot)


def main(argv: list[str] | None = None) -> None:
    """Entry point for the console script."""
    asyncio.run(_async_main(argv))


if __name__ == "__main__":
    main()
