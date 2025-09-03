import { NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_KEY,
});

const analysisPrompt = `
You are an expert SEO analyst. Your task is to analyze the provided text and return a JSON object with two keys: "density" and "suggestions".

1.  **"density"**: This should be a list of the top 10 most relevant keywords or keyphrases (bigrams or trigrams are acceptable) from the text. For each keyword/keyphrase, provide its count. The output should be an array of arrays, where each inner array is \\[<keyword>, <count>\\]
2.  **"suggestions"**: This should be a list of 10 new, related SEO keywords that are *not* already in the text but would be beneficial to include.

**IMPORTANT**: You must return only the JSON object, with no surrounding text or markdown formatting.

Analyze the following text:
`;

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const userMessage = `${analysisPrompt}\n\n\
${content}
\
`;

    const msg = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2048,
      temperature: 0.2,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
    });

    const jsonString = msg.content[0].type === 'text' ? msg.content[0].text : '';
    const result = JSON.parse(jsonString);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error analyzing keywords:', error);
    // Check if the error is from Anthropic and log details
    if (error instanceof Anthropic.APIError) {
      console.error('Anthropic API Error:', error.status, error.headers, error.error);
    }
    return NextResponse.json({ error: 'Failed to analyze keywords' }, { status: 500 });
  }
}