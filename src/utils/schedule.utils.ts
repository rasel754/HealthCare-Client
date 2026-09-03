import { ISchedule } from "@/src/types/domain.types";

export function formatScheduleDateTime(dateStr?: string, timeStr?: string, isoStr?: string): string {
  if (isoStr) {
    try {
      const d = new Date(isoStr);
      if (!isNaN(d.getTime())) {
        return d.toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      }
    } catch (e) {
      // fallback
    }
  }
  if (dateStr && timeStr) {
    return `${dateStr} ${timeStr}`;
  }
  if (dateStr) return dateStr;
  if (timeStr) return timeStr;
  return "N/A";
}

export function calculateScheduleDuration(
  startDate?: string,
  startTime?: string,
  endDate?: string,
  endTime?: string,
  startIso?: string,
  endIso?: string
): string {
  let startMs = 0;
  let endMs = 0;

  if (startIso && endIso) {
    startMs = new Date(startIso).getTime();
    endMs = new Date(endIso).getTime();
  } else if (startDate && startTime && endDate && endTime) {
    startMs = new Date(`${startDate}T${startTime}`).getTime();
    endMs = new Date(`${endDate}T${endTime}`).getTime();
  }

  if (startMs > 0 && endMs > startMs) {
    const totalMinutes = Math.round((endMs - startMs) / (1000 * 60));
    if (totalMinutes < 60) {
      return `${totalMinutes} mins`;
    }
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return mins > 0 ? `${hours} hr ${mins} mins` : `${hours} hr${hours > 1 ? "s" : ""}`;
  }

  if (startTime && endTime) {
    const [sH, sM] = startTime.split(":").map(Number);
    const [eH, eM] = endTime.split(":").map(Number);
    if (!isNaN(sH) && !isNaN(eH)) {
      let diff = eH * 60 + eM - (sH * 60 + sM);
      if (diff < 0) diff += 24 * 60;
      if (diff < 60) return `${diff} mins`;
      const h = Math.floor(diff / 60);
      const m = diff % 60;
      return m > 0 ? `${h} hr ${m} mins` : `${h} hr${h > 1 ? "s" : ""}`;
    }
  }

  return "30 mins";
}

export function getScheduleDetails(slot: ISchedule) {
  const startStr = formatScheduleDateTime(slot.startDate, slot.startTime, slot.startDateTime);
  const endStr = formatScheduleDateTime(slot.endDate, slot.endTime, slot.endDateTime);
  const durationStr = calculateScheduleDuration(
    slot.startDate,
    slot.startTime,
    slot.endDate,
    slot.endTime,
    slot.startDateTime,
    slot.endDateTime
  );

  const doctorSlotsCount = slot.doctorSchedules?.length || 0;

  const isBooked = Boolean(
    slot.isBooked ||
      slot.doctorSchedules?.some((ds) => ds.isBooked) ||
      (slot.appointments && slot.appointments.length > 0)
  );

  // Synchronized Status State: BOOKED > ASSIGNED > AVAILABLE
  let statusState: "BOOKED" | "ASSIGNED" | "AVAILABLE" = "AVAILABLE";
  if (isBooked) {
    statusState = "BOOKED";
  } else if (doctorSlotsCount > 0) {
    statusState = "ASSIGNED";
  }

  const appointmentText =
    slot.appointments && slot.appointments.length > 0
      ? `Appt #${slot.appointments[0].id.slice(-6).toUpperCase()} (${slot.appointments[0].status || "SCHEDULED"})`
      : isBooked
      ? "Booked"
      : "None";

  const createdStr = slot.createdAt
    ? new Date(slot.createdAt).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  const doctorList = (slot.doctorSchedules || []).map((ds) => ({
    doctorId: ds.doctorId,
    name: ds.doctor?.name || "Doctor",
    designation: ds.doctor?.designation || "Specialist",
    profilePhoto: ds.doctor?.profilePhoto,
    isBooked: ds.isBooked,
  }));

  const doctorNames = doctorList.map((d) => d.name).filter(Boolean).join(", ");

  return {
    id: slot.id,
    startStr,
    endStr,
    durationStr,
    doctorSlotsCount,
    doctorList,
    doctorNames,
    isBooked,
    statusState,
    appointmentText,
    createdStr,
  };
}
