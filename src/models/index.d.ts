import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class TrackingNumbers {
  readonly id: string;
  readonly userID: string;
  readonly carrier: string;
  readonly trackingNumber: string;
  readonly userNotes?: string;
  readonly trackingSummary?: (string | null)[];
  readonly dateCreated?: number;
  readonly dateLastUpdated?: number;
  constructor(init: ModelInit<TrackingNumbers>);
  static copyOf(source: TrackingNumbers, mutator: (draft: MutableModel<TrackingNumbers>) => MutableModel<TrackingNumbers> | void): TrackingNumbers;
}