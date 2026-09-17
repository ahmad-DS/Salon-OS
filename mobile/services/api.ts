const API_BASE_URL = process.env.EXPO_BASE_URL;
import { AvailabilityResponse } from "../types/availability";
import { CreateAppointmentRequest, AppointmentResponse } from "../types/appointment"

export async function getServices() {
  const response = await fetch(`${API_BASE_URL}/api/services`);

  if (!response.ok) {
    throw new Error("Failed to fetch services");
  }

  return response.json();
}


export async function getAvailability(
  serviceId: number,
  date: string
): Promise<AvailabilityResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/availability?service_id=${serviceId}&date=${date}`
  );

  if (!response.ok) {
    const data = await response.json();

    throw new Error(
      data.detail || "Failed to fetch availability"
    );
  }

  return response.json();
}

export async function createAppointment(
  request: CreateAppointmentRequest
): Promise<AppointmentResponse> {
  const response = await fetch(`${API_BASE_URL}/api/appointments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to book appointment");
  }

  return data;
}