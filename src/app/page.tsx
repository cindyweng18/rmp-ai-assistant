"use client";
import {
  AppBar,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  Container,
  Divider,
  Grid,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import NavBar from "./navbar";

export default function Home() {
  return (
    <>
      <NavBar />
      <Box
        id="hero"
        sx={{
          backgroundImage: `url("/images/homepage.jpg")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          height: { xs: "400px", sm: "450px", md: "700px", lg: "900px" },
        }}
      >
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Stack
            spacing={2}
            useFlexGap
            sx={{
              height: { xs: "100%", sm: "100%" },
              width: { xs: "80%", sm: "40%", lg: "35%" },
              mt: { xs: 10, sm: 10, md: 30, lg: 40 },
              mb: { xs: 5, sm: 12 },
              backgroundColor: "#FFFFFF",
              border: "#0C232B solid 4px",
              borderRadius: 10,
            }}
          >
            <Typography
              variant="h1"
              sx={{
                color: "#2F5662",
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignSelf: "center",
                textAlign: "center",
                fontSize: "clamp(3.5rem, 10vw, 4rem)",
                fontWeight: "bold",
                mt: 2,
              }}
            >
              Prof
              <Typography
                component="span"
                variant="h1"
                sx={{
                  fontSize: "clamp(3rem, 10vw, 4rem)",
                  color: "#FF745A",
                  fontWeight: "bold",
                }}
              >
                Match
              </Typography>
            </Typography>
            <Typography
              textAlign="center"
              color="text.secondary"
              sx={{ alignSelf: "center", width: { sm: "100%", md: "80%" } }}
            >
              Let our AI make the match of the semester!
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignSelf="center"
              spacing={1}
              useFlexGap
              sx={{ pt: 2, width: { xs: "80%", sm: "auto" } }}
            >
              <Button
                variant="contained"
                href="/signup"
                sx={{
                  mb: 2,
                  backgroundColor: "#2F5662",
                  "&:hover": {
                    backgroundColor: "#FF745A", // Prevent hover background color change
                  },
                }}
              >
                Get Started
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
      <Container
        id="features"
        sx={{
          pt: { xs: 4, sm: 12 },
          pb: { xs: 8, sm: 16 },
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: { xs: 3, sm: 6 },
        }}
      >
        <Box
          sx={{
            width: { sm: "100%", md: "100%" },
            textAlign: { sm: "left", md: "center" },
          }}
        >
          <Typography
            component="h2"
            variant="h4"
            color="text.primary"
            gutterBottom
          >
            {" "}
            Features{" "}
          </Typography>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6} md={4} sx={{ display: "flex" }}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  flexGrow: 1,
                  p: 1,
                }}
              >
                <CardContent>
                  <Typography
                    color="text.primary"
                    variant="body2"
                    fontWeight="bold"
                  >
                    Smart Professor Matching
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Our AI-driven chatbot analyzes thousands of reviews and ratings from Rate
                    My Professor to match you with the best professors for your
                    courses.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4} sx={{ display: "flex" }}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  flexGrow: 1,
                  p: 1,
                }}
              >
                <CardContent>
                  <Typography
                    color="text.primary"
                    variant="body2"
                    fontWeight="bold"
                  >
                    Comprehensive Professor Profiles
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                   Get detailed profiles of professors, including their strengths,
                    weaknesses, and teaching methods, all sourced from authentic
                    student reviews.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4} sx={{ display: "flex" }}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  flexGrow: 1,
                  p: 1,
                }}
              >
                <CardContent>
                  <Typography
                    color="text.primary"
                    variant="body2"
                    fontWeight="bold"
                  >
                    Course Planning Assistance
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Our chatbot helps you plan your course
                    schedule by identifying which professors are teaching the
                    courses you need.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Divider />
    </>
  );
}
