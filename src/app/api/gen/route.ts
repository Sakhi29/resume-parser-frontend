import { NextResponse } from "next/server";
import { groq } from "@/util/groq";

interface InterviewResponse {
  question: string;
  answer: string;
}

export async function POST(request: Request) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      {
        success: false,
        error: "API key not configured. Please contact support.",
      },
      { status: 500 }
    );
  }

  try {
    const { responses }: { responses: InterviewResponse[] } = await request.json();

    if (!responses || !Array.isArray(responses) || responses.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid or empty responses provided",
        },
        { status: 400 }
      );
    }

    const promptString = `Interview Evaluation Task:
            - Carefully review each interview question and its corresponding answer
            - Provide a detailed, constructive evaluation for each response
            - Include:
            1. Relevance of the answer to the question
            2. Suggestions for improvement

            Interview Responses:
            ${responses
              .map(
                (item, index) =>
                  `Question ${index + 1}: ${item.question}\nAnswer: ${item.answer}`
              )
              .join("\n\n")}
            
            Please provide a comprehensive evaluation that breaks down each response, highlighting both strengths and areas for improvement. The evaluation should be professional, specific, and constructive.`;

    const evaluation = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: promptString,
        },
      ],
      model: "mixtral-8x7b-32768",
    });

    const evaluationText = evaluation.choices[0]?.message?.content;

    if (!evaluationText) {
      throw new Error("No evaluation generated by the AI model");
    }

    return NextResponse.json({
      success: true,
      evaluation: evaluationText,
    });
  } catch (error) {
    console.error("Interview evaluation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate evaluation. Please try again later.",
      },
      { status: 500 }
    );
  }
}
