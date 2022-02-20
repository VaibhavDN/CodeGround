const express = require("express");
const cluster = require("cluster");

const totalCPUs = require("os").cpus().length;

const app = express();
const PORT = 3000;

const someHeavyComputation = () => {
  for(let i=0; i<10e5; i++) {}
};

app.get("/light", async (req, res, next) => {
  return res.json({ result: "light" });
});

app.get("/heavy", async (req, res, next) => {
  someHeavyComputation();

  return res.json({ result: "Heavy" });
});

/**
 * Checking if it's a master process
 * If process.env.NODE_UNIQUE_ID is undefined
 * then the isMaster will be true
 */
if (cluster.isMaster) {
  console.log(`Master pid ${process.pid}`);

  // Fork workers.
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died forking another`);
    cluster.fork();
  });
} else {
  app.listen(PORT, () => {
    console.log(
      `Server listening at ${PORT} with clustering using ${totalCPUs} cores. Worker pid: ${process.pid}`
    );
  });
}

/**
 * Testing using loadtest package
 * loadtest http://localhost:3000/light -n 10000 -c 100
 * This will send 10000 requests of which 1000 are concurrent
 * 
 * INFO Target URL:          http://localhost:3000/light
 * INFO Max requests:        10000
 * INFO Concurrency level:   1000
 * INFO Agent:               none
 * INFO 
 * INFO Completed requests:  10000
 * INFO Total errors:        0
 * INFO Total time:          4.690922144 s
 * INFO Requests per second: 2132
 * INFO Mean latency:        452.2 ms
 * INFO 
 * INFO Percentage of the requests served within a certain time
 * INFO   50%      430 ms
 * INFO   90%      614 ms
 * INFO   95%      709 ms
 * INFO   99%      748 ms
 * INFO  100%      774 ms (longest request)
 * 
 * *******************************************************************
 * 
 * INFO Target URL:          http://localhost:3000/heavy
 * INFO Max requests:        10000
 * INFO Concurrency level:   1000
 * INFO Agent:               none
 * INFO 
 * INFO Completed requests:  10000
 * INFO Total errors:        0
 * INFO Total time:          6.902754008 s
 * INFO Requests per second: 1449
 * INFO Mean latency:        661.6 ms
 * INFO 
 * INFO Percentage of the requests served within a certain time
 * INFO   50%      660 ms
 * INFO   90%      807 ms
 * INFO   95%      848 ms
 * INFO   99%      1003 ms
 * INFO  100%      1024 ms (longest request)
 * 
 */
