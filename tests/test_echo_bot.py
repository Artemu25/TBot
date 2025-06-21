import pytest
from echo_bot.__main__ import start, echo, mini, _async_main


class DummyUser:
    def __init__(self, user_id: int = 1):
        self.id = user_id


class DummyMessage:
    def __init__(self, text: str = "hi", user_id: int = 1):
        self.text = text
        self.from_user = DummyUser(user_id)
        self.answered = None
        self.reply_markup = None

    async def answer(self, text: str, reply_markup=None):
        self.answered = text
        self.reply_markup = reply_markup


@pytest.mark.asyncio
async def test_start_sends_welcome_message():
    msg = DummyMessage()
    await start(msg)
    assert msg.answered.startswith("Hello!"), msg.answered


@pytest.mark.asyncio
async def test_echo_replies_with_same_text():
    msg = DummyMessage(text="echo")
    await echo(msg)
    assert msg.answered == "echo"


@pytest.mark.asyncio
async def test_mini_sends_button():
    msg = DummyMessage()
    await mini(msg, "https://example.com")
    assert msg.reply_markup is not None


@pytest.mark.asyncio
async def test_async_main_requires_token(monkeypatch):
    monkeypatch.delenv("BOT_TOKEN", raising=False)
    with pytest.raises(RuntimeError):
        await _async_main([])
