import { NextResponse } from "next/server";
import {
  GoogleGenAI,
} from '@google/genai';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userPrompt = searchParams.get("userPrompt");
  const promptTitle = await fetchPromptTitle(userPrompt || "");
  return NextResponse.json({ promptTitle: promptTitle });
}


async function fetchPromptTitle(userPrompt: string) {
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  const config = {
    responseMimeType: 'text/plain',
    systemInstruction: [
      {
        text: `You are a helpful assistant that takes a user prompt and generates a short, clear project description followed by 1~6 well-formatted, engaging starter questions related to the prompt. This questions will be used during development process to help the AI think more deeply or broadly about the project and make it perfect in a single go.

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
                    `,
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

  const response = await ai.models.generateContent({
    model,
    config,
    contents,
    });
    const promptTitle = response.text
    return promptTitle;
  } catch (error) {
    console.error("Error fetching prompt title:", error);
    return "Error fetching prompt title";
  }
}
