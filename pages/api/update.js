import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const client = await clientPromise;
    const db = client.db('selfappraisal');

    const { collectionName, filter, update } = req.body;

    try {
      const collection = db.collection(collectionName);
      const result = await collection.updateOne(filter, { $set: update });

      res.status(200).json({ message: 'Data updated successfully', result });
    } catch (error) {
      res.status(500).json({ message: 'Error updating data', error });
    }
  } else {
    res.status(405).json({ message: 'Only PUT method is allowed' });
  }
}
