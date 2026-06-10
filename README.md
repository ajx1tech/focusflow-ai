# FocusFlow AI
> AI-powered meeting summarizer and task prioritizer

[![Live Demo](https://img.shields.io/badge/Live--Demo-brightgreen.svg)](#) <!-- placeholder to be updated after Vercel deploy -->
[![Azure OpenAI](https://img.shields.io/badge/Azure--OpenAI-0078D4.svg)](https://azure.microsoft.com/en-us/products/ai-services/openai-service)
[![Next.js 14](https://img.shields.io/badge/Next.js--14-black.svg)](https://nextjs.org/)
[![Vercel](https://img.shields.io/badge/Vercel--Deploy-black.svg)](https://vercel.com/)

## The Problem
In today's fast-paced corporate environment, professionals spend over 30% of their week in meetings, leaving less time for actual deep work. Important action items and key decisions frequently get lost in long, unstructured raw notes or email chains. Without a structured way to extract these insights, teams struggle with accountability, follow-through, and identifying potential blockers before they become critical issues. 

## The Solution
FocusFlow AI is a streamlined productivity tool designed to transform unstructured meeting notes and sprawling email threads into clear, actionable insights instantly. Users simply paste their raw text into the application, and FocusFlow intelligently extracts a concise summary, key decisions, prioritized action items (with assigned owners and due dates), and any potential blockers. This empowers teams to move faster, stay aligned, and ensure that nothing falls through the cracks.

## Live Demo
[Live Demo Link (To be updated after Vercel deploy)](#)

## Architecture

```text
User Browser 
   │
   ▼
Next.js Frontend (Vercel Edge)
   │
   ▼
/api/summarize (Route Handler)
   │
   ▼
Azure OpenAI GPT-4o
   │
   ▼
Structured JSON Extraction
   │
   ▼
Rendered UI (Results Cards)
```

## Tech Stack
- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend & AI**: Next.js API Routes, Azure OpenAI SDK, GPT-4o Model
- **Deployment**: Vercel

## AI Tools Used
This project was built using the following AI tools:
- Azure OpenAI (GPT-4o): core summarization and task extraction engine
- Google Antigravity IDE: agentic development environment used to scaffold, build, and verify the application
- GitHub Copilot: assisted with TypeScript type definitions

## Local Setup

To run FocusFlow AI locally on your machine, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd focusflow-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the example environment file and fill in your Azure credentials.
   ```bash
   cp .env.local.example .env.local
   ```
   *Edit `.env.local` to include your Azure OpenAI API key, endpoint, and deployment name.*

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

To successfully connect to Azure OpenAI, you must configure the following environment variables in your `.env.local` file:

- `AZURE_OPENAI_ENDPOINT`: The base URL for your Azure OpenAI resource (e.g., `https://<your-resource-name>.openai.azure.com/`). Found in the Azure Portal under "Keys and Endpoint".
- `AZURE_OPENAI_API_KEY`: Your secret API key to authenticate requests. Found in the Azure Portal.
- `AZURE_OPENAI_DEPLOYMENT`: The deployment name you chose for your GPT-4o model within Azure OpenAI Studio.

## Data & Privacy
FocusFlow AI is built with privacy in mind. We do not store any user data, meeting notes, or generated summaries in a persistent database. All text is securely transmitted directly to Azure OpenAI for processing, and the results are immediately discarded from memory after being returned to the user's browser. No personally identifiable information (PII) is retained.

## Hackathon Theme
AI at Work: Productivity & Teamwork Reimagined — Microsoft Build AI Hackathon 2026

## Team

| Name | Role | GitHub |
| :--- | :--- | :--- |
| [Your Name Here] | Developer / Designer | [@yourusername](https://github.com/yourusername) |
| [Teammate Name] | [Role] | [@teammate](https://github.com/teammate) |
