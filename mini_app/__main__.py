"""Run a minimal web server for a Telegram mini app."""

from __future__ import annotations

from fastapi import FastAPI
from fastapi.responses import HTMLResponse
import uvicorn

app = FastAPI()

@app.get("/", response_class=HTMLResponse)
async def index() -> str:
    """Serve a simple HTML page for the mini app."""
    return "<html><body><h1>Hello from Mini App</h1></body></html>"


def main(argv: list[str] | None = None) -> None:
    """Run the mini app web server."""
    uvicorn.run(app, host="0.0.0.0", port=8000)


if __name__ == "__main__":
    main()
