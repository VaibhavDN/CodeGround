const { SNSClient } = require("@aws-sdk/client-sns");

const REGION = "us-east-1";
const snsClient = new SNSClient({
  region: REGION,
  credentials: {
    accessKeyId: "test",
    secretAccessKey: "test",
  },
  endpoint: "http://localhost:4566",
});
module.exports = { snsClient };
