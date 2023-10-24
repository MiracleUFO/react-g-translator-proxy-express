import dotenv from 'dotenv';
import mongoose from 'mongoose';
import RequestCountSchema from '../models/RequestCount';

dotenv.config();

function store() {
  if (
    process.env.MONGOOSE_ATLAS_CONNECTION_STRING
    && process.env.MONGOOSE_ATLAS_PASSWORD
  ) {
      const uri = process.env.MONGOOSE_ATLAS_CONNECTION_STRING.replace(
        '<password>',
        encodeURIComponent(process.env.MONGOOSE_ATLAS_PASSWORD)
      );

      return (
        mongoose.connect(uri)
          .then(() => {
            if (RequestCountSchema) {
              const model = mongoose.model('RequestCount', RequestCountSchema);
              return model;
            }
          })
      );
    }
}

export default store;