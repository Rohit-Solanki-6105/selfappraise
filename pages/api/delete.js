// pages/api/delete.js
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const client = await clientPromise;
    const db = client.db('selfappraisal');

    const { collectionName, filter } = req.body;

    try {
      const collection = db.collection(collectionName);
      const result = await collection.deleteOne(filter);

      res.status(200).json({ message: 'Data deleted successfully', result });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting data', error });
    }
  } else {
    res.status(405).json({ message: 'Only DELETE method is allowed' });
  }
}
