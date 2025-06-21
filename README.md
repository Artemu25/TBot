# Hello World Project

This repository contains a minimal Python project that prints "hello world".

## Requirements

- Python 3.8+
- [uv](https://github.com/astral-sh/uv) package manager

## Usage

Create a virtual environment and install the project using `uv`:

```bash
uv venv
source .venv/bin/activate
uv pip install -e .
```

Run the program using `uv`:

```bash
uv run python -m hello_world
```
