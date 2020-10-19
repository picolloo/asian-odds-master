import redis from "redis";
import { promisify } from "util";

import Logger from "../logger";
import redisConfig from "./config";

const client = redis.createClient(redisConfig);

client.on("connect", () => {
  Logger.log("info", "Redis client connected");
});

client.on("error", (error) => {
  Logger.log("error", `Redis error: ${error}`);
});

// usage: await Redis.get()
client.get = promisify(client.get).bind(client);

export default client;
