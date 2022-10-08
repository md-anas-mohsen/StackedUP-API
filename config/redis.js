const { createClient } = require("redis");

const client = createClient({
  url: process.env.REDIS_LOCAL_URI,
});

client.on("error", (err) => console.log("Redis client error ", err));

client
  .connect()
  .then(() => console.log(`Redis connected successfully `))
  .catch((error) => console.log("Redis error ", error.message));

module.exports = client;
