import { Service } from "./service";

export type AvailabilitySlot = {
  start_time: string;
  end_time: string;
  available: boolean;
};

export type AvailabilityResponse = {
  date: string;
  service_id: number;
  service_name: string;
  duration_minutes: number;
  slots: AvailabilitySlot[];
};