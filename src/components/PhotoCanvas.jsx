import React, { useState, useRef } from "react";
import { Stage, Layer, Image, Circle, Group, Line } from "react-konva";
import { Box, Button, Stack } from "@mui/material";
import throwSound from "../assets/egg-cracking.mp3"; // Suara untuk lemparan telur
import splashSound from "../assets/water-splash.mp3"; // Suara untuk splash warna
import punchSound from "../assets/punch.mp3"; // Suara untuk tinju

const PhotoCanvas = ({ photo }) => {
  const [eggs, setEggs] = useState([]); // Array untuk menyimpan semua telur
  const [splashes, setSplashes] = useState([]); // Array untuk splash warna
  const [punches, setPunches] = useState([]); // Array untuk efek tinju
  const [makeupLines, setMakeupLines] = useState([]); // Array untuk garis makeup
  const [mode, setMode] = useState("egg"); // Mode aktif: "egg", "color", "punch", atau "makeup"
  const [isDrawing, setIsDrawing] = useState(false); // Status menggambar makeup

  const stageRef = useRef(null);

  // Fungsi untuk memutar suara
  const playSound = (sound) => {
    const audio = new Audio(sound);
    audio.play();
  };

  // Fungsi untuk melempar telur
  const handleThrowEgg = () => {
    playSound(throwSound); // Putar suara lemparan telur

    // Pastikan posisi acak berada di dalam area gambar
    const x = Math.random() * 300 + 50; // Posisi horizontal acak
    const y = Math.random() * 250 + 25; // Posisi vertikal acak
    const newEgg = {
      id: Date.now(),
      x,
      y,
      cracked: false, // Telur belum pecah
    };

    // Tambahkan telur ke dalam array state
    setEggs((prev) => [...prev, newEgg]);

    // Simulasikan telur pecah setelah 1 detik
    setTimeout(() => {
      setEggs((prev) =>
        prev.map((egg) =>
          egg.id === newEgg.id ? { ...egg, cracked: true } : egg
        )
      );
    }, 1000);
  };

  // Fungsi untuk melempar warna
  const handleThrowColor = (e) => {
    playSound(splashSound); // Putar suara splash
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();

    // Tambahkan splash warna baru
    const newSplash = {
      id: Date.now(),
      x: pointerPosition.x,
      y: pointerPosition.y,
      colors: ["#FF5722", "#FFC107", "#4CAF50", "#2196F3"], // Warna acak
    };
    setSplashes((prev) => [...prev, newSplash]);

    // Hapus splash setelah beberapa detik
    setTimeout(() => {
      setSplashes((prev) => prev.filter((splash) => splash.id !== newSplash.id));
    }, 2000);
  };

  // Fungsi untuk tinju
  const handlePunch = (e) => {
    playSound(punchSound); // Putar suara tinju
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();

    // Tambahkan efek bonyok baru
    const newPunch = {
      id: Date.now(),
      x: pointerPosition.x,
      y: pointerPosition.y,
    };
    setPunches((prev) => [...prev, newPunch]);
  };

  // Fungsi untuk memulai menggambar makeup
  const handleMouseDown = (e) => {
    if (mode === "makeup") {
      setIsDrawing(true);
      const pos = e.target.getStage().getPointerPosition();
      setMakeupLines([...makeupLines, { points: [pos.x, pos.y] }]);
    }
  };

  // Fungsi untuk menggambar makeup
  const handleMouseMove = (e) => {
    if (!isDrawing || mode !== "makeup") return;
    const pos = e.target.getStage().getPointerPosition();
    const lastLine = makeupLines[makeupLines.length - 1];
    lastLine.points = lastLine.points.concat([pos.x, pos.y]);
    setMakeupLines(makeupLines.slice(0, makeupLines.length - 1).concat(lastLine));
  };

  // Fungsi untuk berhenti menggambar makeup
  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  // Fungsi untuk mereset semua elemen
  const handleReset = () => {
    setEggs([]);
    setSplashes([]);
    setPunches([]);
    setMakeupLines([]);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{ my: 4 }}
    >
      {/* Pilihan Mode */}
      <Stack direction="row" spacing={2} mb={2}>
        <Button
          variant={mode === "egg" ? "contained" : "outlined"}
          color="warning"
          onClick={() => setMode("egg")}
        >
          Throw Egg 🥚
        </Button>
        <Button
          variant={mode === "color" ? "contained" : "outlined"}
          color="primary"
          onClick={() => setMode("color")}
        >
          Throw Color 🎨
        </Button>
        <Button
          variant={mode === "punch" ? "contained" : "outlined"}
          color="error"
          onClick={() => setMode("punch")}
        >
          Punch 👊
        </Button>
        <Button
          variant={mode === "makeup" ? "contained" : "outlined"}
          color="success"
          onClick={() => setMode("makeup")}
        >
          Makeup 💄
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleReset}
        >
          Reset 🧹
        </Button>
      </Stack>

      {/* Kanvas */}
      <Stage
        ref={stageRef}
        width={400}
        height={300}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={(e) => {
          if (mode === "egg") handleThrowEgg(); // Memanggil handleThrowEgg
          if (mode === "color") handleThrowColor(e);
          if (mode === "punch") handlePunch(e);
        }}
        style={{
          border: "2px solid #ccc",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <Layer>
          {/* Foto */}
          <Image
            image={photo}
            x={50}
            y={0}
            width={300}
            height={300}
            alt="birthday photo"
          />

          {/* Semua Telur */}
          {eggs.map((egg) => (
            <Group key={egg.id}>
              {!egg.cracked && (
                <Circle x={egg.x} y={egg.y} radius={20} fill="yellow" />
              )}
              {egg.cracked && (
                <Group>
                  <Circle x={egg.x - 10} y={egg.y} radius={10} fill="orange" />
                  <Circle x={egg.x + 10} y={egg.y} radius={12} fill="yellow" />
                  <Circle x={egg.x} y={egg.y + 10} radius={15} fill="white" />
                </Group>
              )}
            </Group>
          ))}

          {/* Splash Warna */}
          {splashes.map((splash) => (
            <Group key={splash.id}>
              {splash.colors.map((color, index) => (
                <Circle
                  key={index}
                  x={splash.x + Math.random() * 50 - 25}
                  y={splash.y + Math.random() * 50 - 25}
                  radius={Math.random() * 10 + 5}
                  fill={color}
                  opacity={0.8}
                />
              ))}
            </Group>
          ))}

          {/* Efek Tinju */}
          {punches.map((punch) => (
            <Circle
              key={punch.id}
              x={punch.x}
              y={punch.y}
              radius={30}
              fill="red"
              opacity={0.6}
            />
          ))}

          {/* Makeup */}
          {makeupLines.map((line, index) => (
            <Line
              key={index}
              points={line.points}
              stroke="pink"
              strokeWidth={3}
              lineCap="round"
              lineJoin="round"
            />
          ))}
        </Layer>
      </Stage>
    </Box>
  );
};

export default PhotoCanvas;
