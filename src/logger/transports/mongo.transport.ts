import { env } from "@/config/env";
import { Collection, MongoClient } from "mongodb";
import { format } from "winston";
import Transport from "winston-transport";

interface MongoTransportOptions {}

const client = new MongoClient(
  `mongodb://${env.LOGS_DATABASE_USER}:${env.LOGS_DATABASE_PASSWORD}@${env.LOGS_DATABASE_HOST}:${env.LOGS_DATABASE_PORT}`,
);

class MongoTransport extends Transport {
  private collection: Collection;

  constructor(options?: MongoTransportOptions) {
    client.connect();
    super(options);
    this.collection = client.db("logs").collection("logs");
  }

  log(info, callback) {
    this.collection.insertOne(info);
    callback();
  }
}

export const mongoTransport = new MongoTransport({
  format: format.combine(format.json(), format.timestamp()),
});
