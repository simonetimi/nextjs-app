import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

export async function connect() {
  if (!MONGO_URI) {
    throw new Error("Couldn't find MONGO_URI in env secrets.");
  }
  try {
    await mongoose.connect(MONGO_URI);
    const connection = mongoose.connection;
    connection.on('connected', () => {
      console.log('Connection to database successful!');
    });
    connection.on('error', (err) => {
      console.log(`Couldn't connect to database: ${err}`);
      process.exit();
    });
  } catch (error) {
    throw new Error(`Error connecting to the database: ${String(error)}`);
  }
}
