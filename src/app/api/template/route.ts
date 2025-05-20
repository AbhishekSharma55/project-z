import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from '@google/genai';
import { BASE_PROMPT } from "../../../../utils/prompts";
import { basePrompt as reactBasePrompt } from "../../../../utils/default/react";

export async function POST(request: NextRequest) {
    const { prompt } = await request.json();
    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
    });

    const config = {
        maxOutputTokens: 200,
        systemInstruction: "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra"
    }
    const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        config,
        contents: [{
            role: 'user',
            parts: [{
                text: prompt
            }]
        }],
    })
    const answer = response.text; // react or node
    if (answer?.includes("react")) {
        return NextResponse.json({
            prompts: [BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
            uiPrompts: [reactBasePrompt]
        })
    }

    return NextResponse.json({ message: "You cant access this" }, { status: 403 })

}
