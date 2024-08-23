'use client'
import { Box, Button, TextField } from '@mui/material';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/fireConfig'; 
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/')
    } catch (error) {
      setError('Failed to sign in. Please check your credentials.');
    }
  };

  const handleSignUpRedirect = () => {
    router.push('/signup'); 
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
          onClick={handleSignIn}
        >
          Sign In
        </Button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <Button
          variant="outlined"
          fullWidth
          onClick={handleSignUpRedirect}
          sx={{ mt: 2 }} 
        >
          Sign Up
        </Button>
      </Box>
    </Box>
  );
}