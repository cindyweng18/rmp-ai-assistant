"use client";
import { TextField, Box, Stack, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I am the Rate My Professor support assistant. How can I help you today?",
    },
  ]);

  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);

    setMessage("");
    const response = fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, {role: 'user', content: message}]),
    }).then(async (res) => {
      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let result = ''
  
      return reader.read().then(async function processText({done, value}): Promise<any> {
        if (done) {
          return Promise.resolve(result)
        }
        const text = decoder.decode(value || new Uint8Array(), {stream: true})
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return [
            ...otherMessages,
            {...lastMessage, content: lastMessage.content + text},
          ]
        })
        return reader.read().then(processText)
      })
    })
  }

  // For uploading reviews to pinecone index
  async function uploadReviews() {
    try {
      const response = await fetch("/api/uploadreview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error uploading reviews: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      console.log("Reviews uploaded successfully:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin')  // Redirect to sign-in page if not authenticated
    }
  }, [user, loading, router])

  if (loading) {
    return <p>Loading...</p>  // Show loading state while checking authentication
  }

  if (!user) {
    return null  // Render nothing if not authenticated (to prevent flash of content)
  }

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        backgroundImage: `url("/images/chatbox.jpg")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >

    <Stack
      direction={'column'}
      width="500px"
      height="700px"
      p={2}
      spacing={3}
    >
        <Button variant="contained" onClick={uploadReviews}>
          Upload Review
        </Button>
        <Stack
          direction="column"
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          {messages.map((message, index) => (
            <Box
              bgcolor={
                message.role === 'assistant'
                  ? '#2F5662'
                  : '#FF745A'
              key={index}
              display="flex"
              justifyContent={
                message.role === "assistant" ? "flex-start" : "flex-end"
              }
            >
                {message.content}
              </Box>
            </Box>
          </Box>
        ))}
      </Stack>
      <Stack direction={'row'} spacing={2}> 
        <TextField
          sx={{
            backgroundColor: "white",
          }}
          label="I'd like to know about professor..."
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button variant="contained" onClick={sendMessage} 
          sx={{
            backgroundColor:"#2F5662",
            "&:hover": {
              backgroundColor: "#FF745A", // Prevent hover background color change
            },
          }}>
          Send
        </Button>
      </Stack>
    </Box>
  );
}
