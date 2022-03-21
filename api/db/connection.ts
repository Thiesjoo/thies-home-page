import { VercelRequest, VercelResponse } from "@vercel/node";
import { MongoClient } from "mongodb";

// Create cached connection variable
let cachedClient: MongoClient = null;

// A function for connecting to MongoDB,
// taking a single parameter of the connection string
export async function connectToDatabase(db: string) {
	// If the database connection is cached,
	// use it instead of creating a new connection
	if (cachedClient) {
		return cachedClient.db(db);
	}

	// If no connection is cached, create a new one
	cachedClient = await MongoClient.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

	// Select the database through the connection,
	// using the database path of the connection string
	let database = cachedClient.db(db);

	return database;
}
