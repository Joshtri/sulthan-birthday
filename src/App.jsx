import React, { useEffect, useState } from "react";
import BirthdayCard from "./components/BirthdayCard";
import PhotoCanvas from "./components/PhotoCanvas";
import { CssBaseline, Container, Box, useMediaQuery, Typography } from "@mui/material";
import Confetti from "react-confetti";

import PersonBirthday from "./assets/sulan1.jpeg"; // Path gambar Anda
import './index.css';

import audioCongratulation from './assets/congratulations.mp3';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';  
import CongratulationsMessage from "./components/CongratulationsMessage";

function App() {
  const photo = new Image();
  photo.src = PersonBirthday;

  const [confettiActive, setConfettiActive] = useState(true);

  // Media query untuk mendeteksi layar kecil
  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    // Matikan confetti setelah beberapa detik
    const timer = setTimeout(() => {
      setConfettiActive(false);
    }, 50000); // Confetti berjalan selama 50 detik
    return () => clearTimeout(timer); // Cleanup timer
  }, []);

  return (
    <>
      <CssBaseline />
      {/* Confetti Animation */}
      {confettiActive && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={30} // Jumlah confetti
        />
      )}

      {/* Autoplay Music */}
      <audio autoPlay>
        <source src={audioCongratulation} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Ucapan Selamat Ulang Tahun */}
        <Box textAlign="center" mb={4}>
          <BirthdayCard name="Sulthan" />
        </Box>

        {/* Kanvas dan Foto */}
        <Box
          display="flex"
          flexDirection={isMobile ? "column" : "row"}
          alignItems="center"
          justifyContent="center"
          gap={3}
          sx={{
            mb: 4,
          }}
        >
          <PhotoCanvas photo={photo} />
        </Box>

        {/* Ucapan Selamat */}
        <Box>
          <CongratulationsMessage />
        </Box>

        {/* Footer */}
        <Box textAlign="center" mt={4}>
          <Typography variant="body2" color="textSecondary">
            © 2025 - Created with ❤️ for Sulthan
          </Typography>
        </Box>
      </Container>
    </>
  );
}

export default App;
