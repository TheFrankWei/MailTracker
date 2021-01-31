import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class TrackingNumber {
  readonly id: string;
  readonly userID: string;
  readonly carrier?: string;
  readonly trackingNumber?: string;
  readonly userNotes?: string;
  readonly trackingSummary?: (string | null)[];
  constructor(init: ModelInit<TrackingNumber>);
  static copyOf(source: TrackingNumber, mutator: (draft: MutableModel<TrackingNumber>) => MutableModel<TrackingNumber> | void): TrackingNumber;
}