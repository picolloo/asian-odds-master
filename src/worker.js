import Queue from "bull";

import Logger from "./logger";
import * as jobs from "./jobs";
import redisConfig from "./redis/config";

const queues = Object.values(jobs).map((job) => ({
  bull: new Queue(job.key, { ...job.config, redis: redisConfig }),
  name: job.key,
  handle: job.handle,
}));

export default {
  queues,
  add(name, data, config) {
    const queue = this.queues.find((queue) => queue.name === name);

    if (!queue) throw new Error("Invalid queue name.");

    return queue.bull.add(data, config);
  },
  process() {
    return this.queues.forEach((queue) => {
      queue.bull.process(queue.handle);

      queue.bull.on("failed", (job, err) => {
        Logger.log("error", `Queue ${queue.name} failed: ${err}`);
      });
    });
  },
};
