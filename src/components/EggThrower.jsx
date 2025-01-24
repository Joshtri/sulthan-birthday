import React from "react";
import { Button } from "@mui/material";

const EggThrower = ({ onThrow }) => {
  return (
    <Button
      variant="contained"
      color="warning"
      size="large"
      onClick={onThrow}
      sx={{
        textTransform: "none",
        fontWeight: "bold",
        px: 4,
        py: 1.5,
        boxShadow: 3,
        ":hover": { backgroundColor: "#f57c00" },
      }}
    >
      Throw Egg 🥚
    </Button>
  );
};

export default EggThrower;
