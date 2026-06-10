import { NextResponse } from 'next/server';
import { AzureOpenAI } from 'openai';

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    if (!endpoint || !apiKey || !deployment) {
      return NextResponse.json(
        { error: 'Azure OpenAI configuration is missing' },
        { status: 500 }
      );
    }

    const client = new AzureOpenAI({
      endpoint,
      apiKey,
      apiVersion: '2024-02-15-preview',
      deployment,
    });

    const systemPrompt = `You are a productivity assistant. Given meeting notes or email content, 
return a JSON object with:
- summary: a 2-3 sentence plain-English summary
- decisions: array of key decisions made (strings)
- tasks: array of { title: string, owner: string, priority: 'high'|'medium'|'low', due: string }
- blockers: array of blockers or risks mentioned (strings)
Return ONLY valid JSON, no markdown fences.`;

    const response = await client.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text },
      ],
      model: deployment,
      temperature: 0.3,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content returned from Azure OpenAI');
    }

    const result = JSON.parse(content);
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during summarization.' },
      { status: 500 }
    );
  }
}
