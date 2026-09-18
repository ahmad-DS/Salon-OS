export type CreateAppointmentRequest = {
  name: string;
  phone: string;
  service_id: number;
  appointment_date: string;
  start_time: string;
};

export type AppointmentResponse = {
  id: number;
  customer_id: number;
  service_id: number;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: string;
  price_at_booking: number;
  duration_at_booking: number;
};

export type CustomerAppointment = {
  id: number;
  service_id: number;
  service_name: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  price: number;
  duration_minutes: number;
};