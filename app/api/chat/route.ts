import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, stream } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message field is required.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY environment variable is not defined.' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    // Handle streaming case if requested via {"stream": true}
    if (stream === true) {
      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash-lite',
        contents: message,
      });

      const encoder = new TextEncoder();
      const readableStream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of responseStream) {
              const text = chunk.text || '';
              controller.enqueue(encoder.encode(text));
            }
            controller.close();
          } catch (err: any) {
            controller.error(err);
          }
        },
      });

      return new Response(readableStream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Transfer-Encoding': 'chunked',
        },
      });
    }

    // Default: Return standard JSON response
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: message,
    });

    return NextResponse.json({
      response: response.text || '',
    });
  } catch (error: any) {
    const errorMessage = error?.message || String(error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
