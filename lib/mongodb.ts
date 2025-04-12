// import { MongoClient } from "mongodb";

// console.log("MONGODB_URI:", process.env.MONGODB_URI);
// console.log("NODE_ENV:", process.env.NODE_ENV);

// const uri = process.env.MONGODB_URI;
// if (!uri) {
//   throw new Error("Please define the MONGODB_URI environment variable in .env.local");
// }

// let client: MongoClient;
// let clientPromise: Promise<MongoClient>;

// declare global {
//   var _mongoClientPromise: Promise<MongoClient>;
// }

// if (process.env.NODE_ENV === "development") {
//   if (!global._mongoClientPromise) {
//     client = new MongoClient(uri);
//     global._mongoClientPromise = client.connect();
//   }
//   clientPromise = global._mongoClientPromise;
// } else {
//   client = new MongoClient(uri);
//   clientPromise = client.connect();
// }
// console.log("Attempting to connect to MongoDB...");

// clientPromise
//   .then(() => {
//     console.log("MongoDB connected successfully!");
//     client.db().command({ ping: 1 }).then(() => console.log("Ping successful"));

//   })
//   .catch((error) => {
//     console.error("MongoDB connection error:", error);
//   });

// export default clientPromise;



import { MongoClient } from "mongodb";

console.log("MONGODB_URI:", process.env.MONGODB_URI);
console.log("NODE_ENV:", process.env.NODE_ENV);

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Ensure that in development, we reuse the MongoClient to prevent multiple connections
declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

console.log("Attempting to connect to MongoDB...");

clientPromise
  .then(() => {
    console.log("MongoDB connected successfully!");
    // Ping the database to verify the connection
    return client.db().command({ ping: 1 });
  })
  .then(() => {
    console.log("MongoDB Ping successful");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

export default clientPromise;
