"use server"; // Enable Server-side function

import { NextResponse, NextRequest } from 'next/server';
import clientPromise from '../lib/mongodb';

// Utility function to create/update collection or database
async function handleMongoAction(action, dbName, collectionName, data) {
  const client = await clientPromise;
  const db = client.db(dbName);
  let result;

  switch (action) {
    case 'createCollection':
      result = await db.createCollection(collectionName);
      return { message: `Collection ${collectionName} created.` };
    case 'insert':
      result = await db.collection(collectionName).insertOne(data);
      return { message: 'Document inserted.', result };
    case 'update':
      result = await db.collection(collectionName).updateOne(
        { _id: data._id },
        { $set: data },
        { upsert: true }
      );
      return { message: 'Document updated.', result };
    case 'dropCollection':
      result = await db.dropCollection(collectionName);
      return { message: `Collection ${collectionName} dropped.` };
    default:
      throw new Error('Invalid action');
  }
}

// Handle API requests
export async function POST(request) {
  try {
    const { action, dbName, collectionName, data } = await request.json();

    // Check if the required parameters are provided
    if (!action || !dbName || !collectionName) {
      return NextResponse.json(
        { message: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Execute the MongoDB operation
    const response = await handleMongoAction(action, dbName, collectionName, data);

    // Return the response as JSON
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error with MongoDB:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
