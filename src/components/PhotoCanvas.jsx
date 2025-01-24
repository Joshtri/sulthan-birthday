import React, { useState, useRef } from "react";
import { Stage, Layer, Image, Circle, Group, Line } from "react-konva";
import { Box, Button, Stack } from "@mui/material";
import throwSound from "../assets/egg-cracking.mp3"; // Suara untuk lemparan telur
import splashSound from "../assets/water-splash.mp3"; // Suara untuk splash warna
import punchSound from "../assets/punch.mp3"; // Suara untuk tinju

const PhotoCanvas = ({ photo }) => {
  const [eggs, setEggs] = useState([]);
  const [splashes, setSplashes] = useState([]);
  const [punches, setPunches] = useState([]);
  const [makeupLines, setMakeupLines] = useState([]);
  const [mode, setMode] = useState("egg");
  const [isDrawing, setIsDrawing] = useState(false);

  const stageRef = useRef(null);

  // Dimensi gambar di kanvas
  const imageDimensions = {
    x: 50,
    y: 0,
    width: 300,
    height: 300,
  };

  // Fungsi untuk memutar suara
  const playSound = (sound) => {
    const audio = new Audio(sound);
    audio.play();
  };

  // Periksa apakah pointer berada di dalam area gambar
  const isInsideImage = (x, y) => {
    const { x: imgX, y: imgY, width, height } = imageDimensions;
    return x >= imgX && x <= imgX + width && y >= imgY && y <= imgY + height;
  };

  // Fungsi untuk melempar telur
  const handleThrowEgg = (e) => {
    playSound(throwSound);

    const pointerPosition = e.target.getStage().getPointerPosition();
    const { x, y } = pointerPosition;

    if (isInsideImage(x, y)) {
      const newEgg = { id: Date.now(), x, y, cracked: false };

      setEggs((prev) => [...prev, newEgg]);

      setTimeout(() => {
        setEggs((prev) =>
          prev.map((egg) => (egg.id === newEgg.id ? { ...egg, cracked: true } : egg))
        );
      }, 1000);
    }
  };

  // Fungsi untuk melempar warna
  const handleThrowColor = (e) => {
    playSound(splashSound);

    const pointerPosition = e.target.getStage().getPointerPosition();
    const { x, y } = pointerPosition;

    if (isInsideImage(x, y)) {
      const newSplash = {
        id: Date.now(),
        x,
        y,
        colors: ["#FF5722", "#FFC107", "#4CAF50", "#2196F3"],
      };
      setSplashes((prev) => [...prev, newSplash]);

      setTimeout(() => {
        setSplashes((prev) => prev.filter((splash) => splash.id !== newSplash.id));
      }, 2000);
    }
  };

  // Fungsi untuk tinju
  const handlePunch = (e) => {
    playSound(punchSound);

    const pointerPosition = e.target.getStage().getPointerPosition();
    const { x, y } = pointerPosition;

    if (isInsideImage(x, y)) {
      const newPunch = { id: Date.now(), x, y };
      setPunches((prev) => [...prev, newPunch]);
    }
  };

  // Fungsi untuk memulai menggambar makeup
  const handleStartDrawing = (e) => {
    if (mode === "makeup") {
      const pointerPosition = e.target.getStage().getPointerPosition();
      const { x, y } = pointerPosition;

      if (isInsideImage(x, y)) {
        setIsDrawing(true);
        setMakeupLines([...makeupLines, { points: [x, y] }]);
      }
    }
  };

  // Fungsi untuk menggambar makeup
  const handleDrawing = (e) => {
    if (!isDrawing || mode !== "makeup") return;

    const pointerPosition = e.target.getStage().getPointerPosition();
    const { x, y } = pointerPosition;

    if (isInsideImage(x, y)) {
      const lastLine = makeupLines[makeupLines.length - 1];
      lastLine.points = lastLine.points.concat([x, y]);
      setMakeupLines(makeupLines.slice(0, makeupLines.length - 1).concat(lastLine));
    }
  };

  // Fungsi untuk berhenti menggambar makeup
  const handleStopDrawing = () => {
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
    <Box display="flex" flexDirection="column" alignItems="center" sx={{ my: 4 }}>
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
        <Button variant="outlined" color="secondary" onClick={handleReset}>
          Reset 🧹
        </Button>
      </Stack>

      {/* Kanvas */}
      <Stage
        ref={stageRef}
        width={400}
        height={300}
        onMouseDown={handleStartDrawing}
        onMouseMove={handleDrawing}
        onMouseUp={handleStopDrawing}
        onTouchStart={handleStartDrawing}
        onTouchMove={handleDrawing}
        onTouchEnd={handleStopDrawing}
        onClick={(e) => {
          if (mode === "egg") handleThrowEgg(e);
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
          <Image {...imageDimensions} image={photo} alt="birthday photo" />

          {/* Semua Telur */}
          {eggs.map((egg) => (
            <Group key={egg.id}>
              {!egg.cracked && <Circle x={egg.x} y={egg.y} radius={20} fill="yellow" />}
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
            <Circle key={punch.id} x={punch.x} y={punch.y} radius={30} fill="red" opacity={0.6} />
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
