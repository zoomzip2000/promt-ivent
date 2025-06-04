# promt-ivent

This project is a simple single-page interface for interacting with the Gemini API.

## Setup

1. Copy `config.json.example` to `config.json` and place your Gemini API key inside.
2. Start a local server from the project directory:
   ```bash
   python3 -m http.server
   ```
3. Open `http://localhost:8000/index.html` in your browser.

The left panel contains buttons for managing prompts. Use the `+` button to add new prompts or the pencil icon to edit existing ones. The right side hosts the chat where messages and model replies appear.
