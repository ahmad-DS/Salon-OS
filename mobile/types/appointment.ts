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