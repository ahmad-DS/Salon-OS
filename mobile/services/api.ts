import { AvailabilityResponse } from "../types/availability";
import {
  CreateAppointmentRequest,
  AppointmentResponse,
} from "../types/appointment";
import { AdminAppointment } from "../types/adminAppointment";
import { saveAdminToken, getAdminToken } from "./authStorage";

const BASE_API_URL = process.env.EXPO_PUBLIC_API_URL;
console.log(BASE_API_URL, "url");

export async function getServices() {
  const response = await fetch(`${BASE_API_URL}/api/services`);

  if (!response.ok) {
    throw new Error("Failed to fetch services");
  }

  return response.json();
}

export async function getAvailability(
  serviceId: number,
  date: string,
): Promise<AvailabilityResponse> {
  const response = await fetch(
    `${BASE_API_URL}/api/availability?service_id=${serviceId}&date=${date}`,
  );

  if (!response.ok) {
    const data = await response.json();

    throw new Error(data.detail || "Failed to fetch availability");
  }

  return response.json();
}

export async function createAppointment(
  request: CreateAppointmentRequest,
): Promise<AppointmentResponse> {
  const response = await fetch(`${BASE_API_URL}/api/appointments`, {
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

export async function getCustomerAppointments(phone: string) {
  const cleanPhone = phone.replace(/\D/g, "");

  const response = await fetch(
    `${BASE_API_URL}/api/appointments?phone=${cleanPhone}`,
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to fetch appointments");
  }

  return data;
}

/* Admin Services */
export async function getAdminAppointments(
  date: string,
): Promise<AdminAppointment[]> {
  const response = await adminFetch(
    `${BASE_API_URL}/api/admin/appointments?date=${date}`,
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to fetch admin appointments");
  }

  return data;
}

export async function updateAdminAppointmentStatus(
  appointmentId: number,
  status: "confirmed" | "cancelled" | "completed",
): Promise<void> {
  const response = await adminFetch(
    `${BASE_API_URL}/api/admin/appointments/${appointmentId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to update appointment");
  }
}


export async function adminLogin(
  email: string,
  password: string
) {
  const response = await fetch(
    `${BASE_API_URL}/api/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Invalid email or password"
    );
  }

  await saveAdminToken(data.access_token);

  return data;
}


async function adminFetch(
  url: string,
  options: RequestInit = {}
) {
  const token = await getAdminToken();

  if (!token) {
    throw new Error("Admin authentication required");
  }

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}