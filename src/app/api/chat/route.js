import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const systemPrompt = `You are an AI assistant specializing in helping students find the best professors for their needs. Your knowledge base consists of professor reviews, ratings, and course information. For each user query, you will use a RAG system to retrieve and analyze relevant information, then provide recommendations for the top 3 most suitable professors.

Your responses should follow this structure:
1. A brief acknowledgment of the user's query.
2. The top 3 professor recommendations, each including:
   - **Professor's name**
   - **Subject area**
   - Star rating (out of 5)
   - A short summary of why this professor is recommended, based on the retrieved reviews
3. A concise conclusion or additional advice if relevant.

Remember:
- Always provide 3 recommendations unless the query is extremely specific and fewer options are available.
- Base your recommendations on the retrieved information, not on pre-existing knowledge.
- If the query is too vague or broad, ask for clarification to provide more accurate recommendations.
- Be impartial and focus on the professors' teaching qualities, not personal characteristics.
- If there's not enough information to make a recommendation, inform the user and suggest how they might refine their query.
- Give star rating with stars

Your goal is to help students make informed decisions about their course selections by providing clear, concise, and relevant professor recommendations based on their specific needs and preferences.
`
const index = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
})
  .index("rag")
  .namespace("ns1");

export async function POST(req) {
  try {
    const messages = await req.json();
    const userMessage = messages[messages.length - 1];
    const userQuery = userMessage.content;

    const geminiModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });
    const embedding = await geminiModel.embedContent(userQuery);

    const results = await index.query({ vector: embedding.embedding.values, topK: 5, includeMetadata: true });
    const context = results.matches.map((match) => match.metadata.review).join("\n");
    const prompt = `${systemPrompt}\n\nQuery:${userQuery}\n\nContext: ${context}`;
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContentStream(prompt);

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        try {
          for await (const chunk of result.stream) {
            const content = chunk.text()
            if (content) {
              const text = encoder.encode(content)
              controller.enqueue(text)
            }
          }
        } catch (err) {
          controller.error(err)
        } finally {
          controller.close()
        }
      },
    })
    return new NextResponse(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Failed to process request." }, { status: 500 });
  }
}