// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { TrackingNumbers } = initSchema(schema);

export {
  TrackingNumbers
};