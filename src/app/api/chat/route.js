import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const systemPrompt = 'You are an intelligent assistant for the RateMyProfessor system. Your primary role is to help students find the best professors based on their specific queries. Using the Retrieval-Augmented Generation (RAG) approach, you will retrieve relevant information about professors and generate responses to student questions.'
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
    const prompt = `${systemPrompt}\n\n**Query:** ${userQuery}\n\n**Context:** ${context}`;
    
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