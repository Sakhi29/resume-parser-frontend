import { NextResponse } from "next/server";
import { groq } from "@/util/groq";

interface InterviewResponse {
  question: string;
  answer: string;
}

export async function POST(request: Request) {
  try {
    const { responses }: { responses: InterviewResponse[] } =
      await request.json();

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
                  `Question ${index + 1}: ${item.question} Answer: ${
                    item.answer
                  }`
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

    const evaluationText =
      evaluation.choices[0]?.message?.content || "No evaluation generated";

    return NextResponse.json({
      success: true,
      evaluation: evaluationText,
    });
  } catch (error) {
    console.error("Interview evaluation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to evaluate interview",
      },
      { status: 500 }
    );
  }
}
