'use client'
import { Box, Button, TextField } from '@mui/material';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/fireConfig'; // Adjust the import path if necessary
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter(); // Initialize the router

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Redirect or handle successful sign-up
      router.push('/signin'); 
    } catch (error) {
      setError('Failed to sign up. Please try again.');
    }
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        width="300px"
        p={3}
        border="1px solid black"
        borderRadius="8px"
      >
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          fullWidth
          onClick={handleSignUp}
        >
          Sign Up
        </Button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </Box>
    </Box>
  );
}