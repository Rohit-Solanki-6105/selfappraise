import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);
const dbName = 'selfappraisal';
const collectionName = 'users';

export async function GET(req) {
  try {
    const { email } = req.nextUrl.searchParams; // Retrieve email from query parameters
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const user = await collection.findOne({ email });

    return NextResponse.json({ exists: !!user });
  } catch (error) {
    console.error('Error checking user:', error);
    return NextResponse.error();
  } finally {
    await client.close();
  }
}
