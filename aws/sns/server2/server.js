const express = require("express");
const cors = require("cors");
const { subscribe } = require("./subscriber");

const app = express();
app.use(cors());

const PORT = 8080;

app.use(express.urlencoded({ extended: false }));
app.use(express.text()); // Note we are not using json here

app.get("/subscribe", async (req, res, next) => {
  subscribe();
  res.json({ status: true });
});

app.post("/neworder", async (req, res, next) => {
  console.log(req.body);
  return res.json({ status: true });
});

app.listen(PORT, async () => {
  console.log(`Server running at port ${PORT}`);
});

// awslocal sns create-topic --name orders.fifo --attributes FifoTopic=true
// docker network create -d bridge --subnet 192.168.0.0/24 --gateway 192.168.0.1 mynet
// It is a good idea to configure a dead letter queue for a subscription
