import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../config/queryKeys";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface DoctorProfile {
  id: string;
  name: string;
  role: string;
  initials: string;
  avatarUrl?: string;
  isOnline: boolean;
}

export interface AppointmentBadge {
  queueCount: number;
  attendedCount: number;
}

// ── API functions ──────────────────────────────────────────────────────────────

const fetchDoctorProfile = async (): Promise<DoctorProfile> => {
  const res = await fetch("/api/doctor/me");
  if (!res.ok) throw new Error("Failed to fetch doctor profile");
  return res.json();
};

const fetchAppointmentBadge = async (): Promise<AppointmentBadge> => {
  const res = await fetch("/api/doctor/appointments/badge");
  if (!res.ok) throw new Error("Failed to fetch appointment badge");
  return res.json();
};

// ── Hooks ──────────────────────────────────────────────────────────────────────

/**
 * Fetches the logged-in doctor's profile for the sidebar footer.
 */
export const useDoctorProfile = () =>
  useQuery<DoctorProfile>({
    queryKey: queryKeys.doctor.profile,
    queryFn: fetchDoctorProfile,
    staleTime: 5 * 60 * 1000, // 5 min — profile rarely changes
  });

/**
 * Fetches live queue + attended count for the Appointments nav badge.
 * Refetches every 30 s to stay current without a websocket.
 */
export const useAppointmentBadge = () =>
  useQuery<AppointmentBadge>({
    queryKey: queryKeys.doctor.appointmentBadge,
    queryFn: fetchAppointmentBadge,
    refetchInterval: 30_000,
  });