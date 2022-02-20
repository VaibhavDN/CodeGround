import express from "express";
import { Kafka } from "kafkajs";

const PORT = 3000;
const app = express();

app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
})
