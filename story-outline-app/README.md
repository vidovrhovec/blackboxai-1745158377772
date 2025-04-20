# AI Story Outline Creator

A web-based tool to help writers brainstorm, outline, and develop story ideas using AI-generated prompts. This project uses Tailwind CSS for styling and vanilla JavaScript for interactivity.

## Features

- Generate brainstorming ideas for pitches and characters.
- Create detailed story outlines based on user input.
- Develop setting, character, writing, editing, and title prompts.
- API settings modal to configure AI provider endpoint, API key, and model selection.
- Responsive and modern UI using Tailwind CSS and Font Awesome icons.

## Technologies Used

- HTML5, CSS3 (Tailwind CSS via CDN)
- JavaScript (vanilla)
- Google Fonts (Inter)
- Font Awesome for icons

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)
- Optional: An AI API endpoint and API key for model integration

### Running Locally

1. Clone or download the repository.
2. Navigate to the `story-outline-app` directory.
3. Start a local HTTP server (e.g., using Python):

```bash
python3 -m http.server 8000
```

4. Open your browser and go to `http://localhost:8000`.

### Usage

- Use the form sections to input your story details.
- Click the "Generate" buttons to see AI-generated prompts (simulated).
- Open the API Settings modal (gear icon) to configure your AI API endpoint, key, and model.
- Refresh the model list to fetch available models from your API provider.

## Preparing for GitHub

- The project is organized in the `story-outline-app` folder.
- All source files (`index.html`, `script.js`, and `README.md`) are included.
- No build steps are required; the project runs directly in the browser.
- Ensure `.gitignore` includes any sensitive files if added later (e.g., API keys).

## Future Improvements

- Implement real AI API integration for prompt generation.
- Add backend proxy to handle API requests securely and avoid CORS issues.
- Enhance UI with additional features and accessibility improvements.

## License

This project is open source and available under the MIT License.

## Contact

For questions or feedback, please open an issue or contact the maintainer.
