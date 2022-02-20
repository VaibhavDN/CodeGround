const express = require("express");

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

app.listen(PORT, () => {
  console.log(`Server listening at ${PORT}`);
});

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
 * INFO Total time:          4.499381696 s
 * INFO Requests per second: 2223
 * INFO Mean latency:        372.3 ms
 * INFO 
 * INFO Percentage of the requests served within a certain time
 * INFO   50%      241 ms
 * INFO   90%      1037 ms
 * INFO   95%      1259 ms
 * INFO   99%      1346 ms
 * INFO  100%      3068 ms (longest request)
 * 
 * ************************************************************************
 * 
 * INFO Target URL:          http://localhost:3000/heavy
 * INFO Max requests:        10000
 * INFO Concurrency level:   1000
 * INFO Agent:               none
 * INFO 
 * INFO Completed requests:  10000
 * INFO Total errors:        0
 * INFO Total time:          8.69843895 s
 * INFO Requests per second: 1150
 * INFO Mean latency:        793.7 ms
 * INFO 
 * INFO Percentage of the requests served within a certain time
 * INFO   50%      482 ms
 * INFO   90%      1515 ms
 * INFO   95%      1639 ms
 * INFO   99%      3579 ms
 * INFO  100%      3663 ms (longest request)
 * 
 */
