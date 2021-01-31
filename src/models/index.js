// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { TrackingNumber } = initSchema(schema);

export {
  TrackingNumber
};