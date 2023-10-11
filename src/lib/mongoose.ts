import dotenv from 'dotenv';
import mongoose from 'mongoose';
import MongooseStore from 'express-brute-mongoose';
import BruteForceSchema from 'express-brute-mongoose/dist/schema';

dotenv.config();

function store() {
  if (
    process.env.MONGOOSE_CONNECTION_STRING
    && process.env.MONGOOSE_PASSWORD
  ) {
      const uri = process.env.MONGOOSE_CONNECTION_STRING.replace(
        '<password>',
        encodeURIComponent(process.env.MONGOOSE_PASSWORD)
      );

      return (
        mongoose.connect(uri)
          .then(() => {
            const schema = new mongoose.Schema(BruteForceSchema);
            if (schema) {
              const model = mongoose.model('bruteforce', schema);
    
              const store = new MongooseStore(model);
              return store;
            }
          })
      );
    }
}

export default store;