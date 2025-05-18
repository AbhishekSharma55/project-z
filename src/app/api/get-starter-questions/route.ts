// Backend: API Route
// This goes in app/api/generate-questions/route.ts or similar

import { NextResponse } from "next/server";
import { GoogleGenAI } from '@google/genai';

// Helper function to add delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to process text chunk
const processTextChunk = (text: string): string[] => {
    // Split into sentences and preserve markdown formatting
    return text.split(/(?<=[\.\?\!]\s+)/).filter(Boolean);
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const promptTitle = searchParams.get("promptTitle");
    const userPrompt = searchParams.get("userPrompt");

    if (!userPrompt) {
        return NextResponse.json({ error: "User prompt is required" }, { status: 400 });
    }

    try {
        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY || "",
        });
        const config = {
            responseMimeType: 'text/plain',
            systemInstruction: [
                {
                    text: `You are a helpful assistant that takes a user prompt and generates a short, clear project description followed by 3-4 well-formatted, engaging starter questions related to the prompt.

                    First, output a brief and concise description of the project based on the user's input. This description should help summarize the overall purpose or goal of the project in 1-2 sentences.
                    
                    Please ensure you generate all questions in a <questionsection> tag and a </questionsection> tag.
                    
                    Then, generate 3-4 starter questions that help guide the user in thinking more deeply or broadly about the project. Format each question on a new line, wrapped inside XML tags like this:
                    
                    <question>Your question here?</question>
                    
                    Ensure that all questions are insightful, relevant to the user's prompt, and aimed at helping them clarify or expand their project idea.
                    
                    Example : 
                    <questionsection>
                    <question>question 1</question>
                    <question>question 2</question>
                    <question>question 3</question>
                    </questionsection>
                    `
                }
            ],
        };
        const model = 'gemini-2.0-flash';
        const contents = [
            {
                role: 'user',
                parts: [
                    {
                        text: userPrompt,
                    },
                ],
            },
        ];

        // Create a new ReadableStream
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    const response = await ai.models.generateContentStream({
                        model,
                        config,
                        contents,
                    });

                    let buffer = '';

                    for await (const chunk of response) {
                        const text = chunk?.text;
                        if (text) {
                            buffer += text;

                            // Process complete sentences
                            const sentences = processTextChunk(buffer);
                            if (sentences.length > 0) {
                                // Keep the last incomplete sentence in buffer
                                buffer = sentences.pop() || '';

                                // Stream complete sentences
                                for (const sentence of sentences) {
                                    const words = sentence.split(/(\s+)/);
                                    for (const word of words) {
                                        await delay(30); // Reduced delay for smoother flow
                                        controller.enqueue(new TextEncoder().encode(word));
                                    }
                                }
                            }
                        }
                    }

                    // Send any remaining text in buffer
                    if (buffer) {
                        const words = buffer.split(/(\s+)/);
                        for (const word of words) {
                            await delay(30);
                            controller.enqueue(new TextEncoder().encode(word));
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
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to generate response"
        }, { status: 500 });
    }
}