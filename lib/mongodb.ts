
import { MongoClient } from "mongodb";


const uri = process.env.MONGODB_URI;
const options = {};

if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect().then(() => client);
  }
  clientPromise = global._mongoClientPromise;
} else {
  const client = new MongoClient(uri, options);
  clientPromise = client.connect().then(() => client);
}

export default clientPromise;
