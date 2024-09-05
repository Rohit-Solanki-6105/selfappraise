import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);
const dbName = 'selfappraisal';
const collectionName = 'users';

export async function POST(req) {
  try {
    const { email, fullName, username } = await req.json(); // Extract user data from request body
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    
    // Check if the user already exists
    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // Insert user if not exists
    const result = await collection.insertOne({ email, fullName, username });

    return NextResponse.json({ insertedId: result.insertedId });
  } catch (error) {
    console.error('Error adding user:', error);
    return NextResponse.error();
  } finally {
    await client.close();
  }
}
