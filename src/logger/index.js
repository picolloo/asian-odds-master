import winston from "winston";
import CloudWatchTransport from "winston-aws-cloudwatch";

export default winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.Console(),
    new CloudWatchTransport({
      logGroupName: "asianodds",
      logStreamName: "worker",
      submissionInterval: 2000,
      submissionRetryCount: 1,
      batchSize: 20,
      awsConfig: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
      },
    }),
  ],
});
