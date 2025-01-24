import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Avatar, Stack, TextField, Button, List, ListItem, ListItemText } from "@mui/material";
import CelebrationIcon from "@mui/icons-material/Celebration";
import FavoriteIcon from "@mui/icons-material/Favorite";
import axios from "axios";

const API_URL = "https://sls-api-three.vercel.app/api/messages";

const CongratulationsMessage = () => {
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  // Fetch messages dari API
  useEffect(() => {
    axios.get(API_URL).then((res) => {
      setMessages(res.data);
    });
  }, []);

  // Fungsi untuk mengirim ucapan baru
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !message) {
      alert("Name and message are required!");
      return;
    }

    const newMessage = { name, message };

    axios.post(API_URL, newMessage).then((res) => {
      setMessages([...messages, res.data]);
      setName("");
      setMessage("");
    });
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      mt={4}
      sx={{ width: "100%" }}
    >
      <Card
        sx={{
          maxWidth: 600,
          borderRadius: 4,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          bgcolor: "background.paper",
          p: 2,
        }}
      >
        <CardContent>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
            mb={2}
          >
            <Avatar
              sx={{
                bgcolor: "secondary.main",
                width: 56,
                height: 56,
              }}
            >
              <CelebrationIcon fontSize="large" />
            </Avatar>
            <Typography
              variant="h4"
              component="div"
              color="text.primary"
              sx={{ fontWeight: "bold", textAlign: "center" }}
            >
              Congratulations!
            </Typography>
          </Stack>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ mb: 2 }}
          >
            Share your message of love and joy below! 🎉
          </Typography>

          {/* Form untuk mengirim ucapan */}
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
              />
              <TextField
                label="Your Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                fullWidth
                multiline
                rows={3}
              />
              <Button variant="contained" color="primary" type="submit">
                Send Message
              </Button>
            </Stack>
          </form>

          {/* List Ucapan */}
          <List sx={{ mt: 3, maxHeight: 200, overflow: "auto" }}>
          {messages.map((msg, index) => (
            <ListItem key={msg.id || index} divider>
                <ListItemText
                primary={`${msg.name}:`}
                secondary={msg.message}
                />
            </ListItem>
            ))}
          </List>
          {/* <Stack direction="row" justifyContent="center" mt={2}>
            <FavoriteIcon color="error" fontSize="large" />
          </Stack> */}
        </CardContent>
      </Card>
    </Box>
  );
};

export default CongratulationsMessage;
