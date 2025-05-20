import { NextRequest, NextResponse } from "next/server";
import { getSystemPrompt } from "../../../../utils/prompts";
import { GoogleGenAI } from '@google/genai';

export async function POST(request: NextRequest) {
    const { messages } = await request.json();
    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
    });

    const config = {
        maxOutputTokens: 8000,
        responseMimeType: 'text/plain',
        systemInstruction: [
            {
                text: getSystemPrompt()
            }
        ]
    };

    // Format messages according to Gemini API requirements
    const formattedContents = messages.map((msg: any) => ({
        role: msg.role,
        parts: [
            {
                text: msg.content
            }
        ]
    }));

    // Create a new ReadableStream
    const stream = new ReadableStream({
        async start(controller) {
            try {
                const response = await ai.models.generateContentStream({
                    model: 'gemini-1.5-flash',
                    config,
                    contents: formattedContents
                });

                for await (const chunk of response) {
                    if (chunk.text) {
                        controller.enqueue(new TextEncoder().encode(chunk.text));
                    }
                }

                controller.close();
            } catch (error) {
                controller.error(error);
            }
        },
    });

    // Return the stream with appropriate headers
    return new Response(stream, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Transfer-Encoding': 'chunked',
        },
    });
}