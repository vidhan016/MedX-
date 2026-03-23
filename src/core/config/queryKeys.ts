export const queryKeys = {
  appointments: {
    all:    ["appointments"] as const,
    list:   (f: unknown) => ["appointments", "list", f] as const,
    detail: (id: string)  => ["appointments", id] as const,
  },
  patients: {
    all:    ["patients"] as const,
    list:   (f: unknown) => ["patients", "list", f] as const,
    detail: (id: string)  => ["patients", id] as const,
  },
  doctor: {
    profile:          ["doctor", "profile"] as const,
    appointmentBadge: ["doctor", "appointment-badge"] as const,

    // ── Doctor home dashboard ──
    homeStats:      ["doctor", "home-stats"] as const,
    todaySchedule:  ["doctor", "today-schedule"] as const,
    upcoming:       ["doctor", "upcoming"] as const,
    recentActivity: ["doctor", "recent-activity"] as const,
    topDiagnoses:   (filter: string, range?: { from: string; to: string }) =>
                      ["doctor", "top-diagnoses", filter, range] as const,

    // ── Doctor appointments ──
    queue:            (f: unknown) => ["doctor", "queue", f] as const,
    attended:         (f: unknown) => ["doctor", "attended", f] as const,
    appointmentStats: ["doctor", "appointment-stats"] as const,
    reportsData: (period: string) => ["doctor", "reports", period] as const,
  },
  dashboard: {
    stats:  ["dashboard", "stats"] as const,
    hourly: ["dashboard", "hourly"] as const,
  },
  consultation: {
    detail: (apptId: string) => ["consultation", apptId] as const,
  },
} as const;