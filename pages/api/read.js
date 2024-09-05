import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const client = await clientPromise;
    const db = client.db('selfappraisal');

    const { collectionName } = req.query;

    try {
      const collection = db.collection(collectionName);
      const data = await collection.find({}).toArray();

      res.status(200).json({ message: 'Data fetched successfully', data });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching data', error });
    }
  } else {
    res.status(405).json({ message: 'Only GET method is allowed' });
  }
}
