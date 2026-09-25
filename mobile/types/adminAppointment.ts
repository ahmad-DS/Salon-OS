export type AdminAppointment = {
  id: number;
  customer_name: string;
  phone: string;
  service_name: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  price: number;
  duration_minutes: number;
};