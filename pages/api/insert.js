import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const client = await clientPromise;
    const db = client.db('selfappraisal'); // Your database name

    const { collectionName, data } = req.body;

    try {
      const collection = db.collection(collectionName);
      const result = await collection.insertOne(data);

      res.status(200).json({ message: 'Data inserted successfully', result });
    } catch (error) {
      res.status(500).json({ message: 'Error inserting data', error });
    }
  } else {
    res.status(405).json({ message: 'Only POST method is allowed' });
  }
}
