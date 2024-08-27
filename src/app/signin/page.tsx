'use client'
import { Box, Button, TextField, Typography} from '@mui/material';
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
      router.push('/chatbox')
    } catch (error) {
      setError('Failed to sign in. Please check your credentials.');
    }
  };

  const handleSignUpRedirect = () => {
    router.push('/signup'); 
  };


  return (
    <>
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        backgroundImage: `url("/images/register.jpg")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        height: { xs: "400px", sm: "450px", md: "700px", lg: "900px" },
      }}
    >
      <Box
        width="300px"
        p={3}
        border="1px solid black"
        borderRadius="8px"
        sx={{
          backgroundColor:"white",
        }}
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
          Log In
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
        <Typography textAlign={'center'} marginTop={1} fontSize={15}>Need an account? Sign Up!</Typography>
      </Box>
    </Box>
    </>
  );
}