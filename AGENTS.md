# Repository Guidelines

- **Python version**: 3.12+
- **Install dependencies**: `uv sync`
- (Optional) check for dependency conflicts with `uv pip check`.
- **Before committing**: run `pytest -q` within the `tests` directory.
- **Code formatting**: use `black` or a compatible formatter.
- **Run the example bot**: `env BOT_TOKEN=<TOKEN> uv run echo-bot`. Use `--help` to see available options.
- **Docs updates**: if you modify files in `docs/`, confirm that `docs/index.html` opens correctly in your browser.
