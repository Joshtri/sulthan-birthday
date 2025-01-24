import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const BirthdayCard = ({ name }) => {
  return (
    <Card sx={{ maxWidth: 500, mx: "auto", mb: 4, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h4" component="h1" color="primary" gutterBottom>
          Happy Birthday, {name}! 🎉
        </Typography>
        <Typography variant="body1" color="text.secondary">
          May your day be filled with joy and surprises!
        </Typography>
      </CardContent>
    </Card>
  );
};

export default BirthdayCard;
