from dotenv import load_dotenv
load_dotenv()
from pinecone import Pinecone, ServerlessSpec
# from openai import OpenAI
import google.generativeai as genai
import os
import json

# Find env local file
env_path = os.path.join(os.path.dirname(__file__), '../.env.local')
load_dotenv(dotenv_path=env_path)
# Initialize Pinecone
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

# Create a Pinecone index
pc.create_index(
    name="rag",
    dimension=768,
    metric="cosine",
    spec=ServerlessSpec(cloud="aws", region="us-east-1"),
)

# Load the review data
data = json.load(open("reviews.json"))

processed_data = []
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Create embeddings for each review
for review in data["reviews"]:
    response = genai.embed_content(
        content=review['review'], 
        model="models/text-embedding-004")
    
    embedding = response['embedding']

    processed_data.append(
        {
            "values": embedding,
            "id": review["professor"],
            "metadata":{
                "review": review["review"],
                "subject": review["subject"],
                "stars": review["stars"],
            }
        }
    )

# Insert the embeddings into the Pinecone index

index = pc.Index("rag")
upsert_response = index.upsert(
    vectors=processed_data,
    namespace="ns1",
)
print(f"Upserted count: {upsert_response['upserted_count']}")

# Print index statistics
print(index.describe_index_stats())