# Firebase Studio

This is a NextJS starter in Firebase Studio.

## Running Locally

You can download this project and run it on your local machine. Here's how to get it set up:

### 1. Install Dependencies

Once you've downloaded the code, navigate to the project directory in your terminal and install the necessary packages using npm:

```bash
npm install
```

### 2. Set Up Environment Variables

The application uses Genkit and the Google AI Gemini model for its generative AI features. To use these, you'll need a Gemini API key.

1.  Create a new file named `.env.local` in the root of your project directory.
2.  Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
3.  Add the following line to your `.env.local` file, replacing `<YOUR_API_KEY>` with the key you just obtained:

```
GEMINI_API_KEY=<YOUR_API_KEY>
```

### 3. Run the Development Servers

This project has two main parts that need to run simultaneously for local development: the Next.js frontend and the Genkit AI flows.

1.  **Start the Next.js app:**
    Open a terminal, navigate to your project folder, and run:
    ```bash
    npm run dev
    ```
    This will typically start the web application on `http://localhost:3000`.

2.  **Start the Genkit flows:**
    Open a *second* terminal, navigate to the same project folder, and run:
    ```bash
    npm run genkit:watch
    ```
    This will start the Genkit development server, which makes your AI flows available to the Next.js application.

Once both are running, you can open your browser to `http://localhost:3000` to use the application!