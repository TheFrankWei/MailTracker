import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class Users {
  readonly id: string;
  readonly password?: string;
  readonly TrackingNumbers?: (TrackingNumbers | null)[];
  constructor(init: ModelInit<Users>);
  static copyOf(source: Users, mutator: (draft: MutableModel<Users>) => MutableModel<Users> | void): Users;
}

export declare class TrackingNumbers {
  readonly id: string;
  readonly carrier?: string;
  readonly tracking_summary?: string;
  readonly user_notes?: string;
  readonly untitledmodelID: string;
  constructor(init: ModelInit<TrackingNumbers>);
  static copyOf(source: TrackingNumbers, mutator: (draft: MutableModel<TrackingNumbers>) => MutableModel<TrackingNumbers> | void): TrackingNumbers;
}