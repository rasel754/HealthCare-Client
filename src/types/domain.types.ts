import {
  AppointmentStatus,
  BloodGroup,
  Gender,
  MaritalStatus,
  PaymentStatus,
  Role,
  UserStatus,
} from "./auth.type";

export interface ISpecialty {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IDoctorSpecialty {
  specialtiesId: string;
  doctorId: string;
  specialties: ISpecialty;
}

export interface IDoctor {
  id: string;
  email: string;
  name: string;
  profilePhoto?: string;
  contactNumber: string;
  address?: string;
  registrationNumber: string;
  experience?: number;
  gender: Gender;
  appointmentFee: number;
  qualification: string;
  currentWorkingPlace: string;
  designation: string;
  isDeleted?: boolean;
  averageRating?: number;
  doctorSpecialties?: IDoctorSpecialty[];
  specialties?: ISpecialty[] | string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IAdmin {
  id: string;
  email: string;
  name: string;
  profilePhoto?: string;
  contactNumber?: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ISuperAdmin {
  id: string;
  email: string;
  name: string;
  profilePhoto?: string;
  contactNumber?: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IPatientHealthData {
  id?: string;
  patientId?: string;
  gender?: Gender;
  dateOfBirth?: string;
  bloodGroup?: BloodGroup;
  height?: string;
  weight?: string;
  maritalStatus?: MaritalStatus;
  hasAllergies?: boolean;
  hasDiabetes?: boolean;
  smokingStatus?: boolean;
  dietaryPreferences?: string;
  pregnancyStatus?: boolean;
  mentalHealthHistory?: string;
  immunizationStatus?: string;
  hasPastSurgeries?: boolean;
  recentAnxiety?: boolean;
  recentDepression?: boolean;
}

export interface IMedicalReport {
  id: string;
  patientId?: string;
  reportName: string;
  reportLink: string;
  createdAt?: string;
}

export interface IPatient {
  id: string;
  email: string;
  name: string;
  profilePhoto?: string;
  contactNumber?: string;
  address?: string;
  status?: UserStatus;
  isDeleted?: boolean;
  patientHealthData?: IPatientHealthData;
  medicalReport?: IMedicalReport[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ISchedule {
  id: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  isBooked?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IDoctorSchedule {
  doctorId: string;
  scheduleId: string;
  isBooked: boolean;
  appointmentId?: string | null;
  schedule: ISchedule;
  doctor?: IDoctor;
}

export interface IPayment {
  id: string;
  appointmentId: string;
  amount: number;
  transactionId?: string;
  status: PaymentStatus;
  paymentGatewayData?: Record<string, unknown>;
  appointment?: IAppointment;
  createdAt?: string;
  updatedAt?: string;
}

export interface IAppointment {
  id: string;
  patientId: string;
  doctorId: string;
  scheduleId: string;
  videoCallingId: string;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  createdAt?: string;
  updatedAt?: string;
  doctor?: IDoctor;
  patient?: IPatient;
  schedule?: ISchedule;
  payment?: IPayment;
}

export interface IPrescription {
  id: string;
  appointmentId: string;
  doctorId: string;
  patientId: string;
  instructions: string;
  followUpDate?: string;
  createdAt?: string;
  updatedAt?: string;
  doctor?: IDoctor;
  patient?: IPatient;
  appointment?: IAppointment;
}

export interface IReview {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId: string;
  rating: number;
  comment: string;
  createdAt?: string;
  updatedAt?: string;
  patient?: IPatient;
  doctor?: IDoctor;
}

export interface IDashboardStats {
  appointmentCount?: number;
  doctorCount?: number;
  patientCount?: number;
  userCount?: number;
  reviewCount?: number;
  totalRevenue?: number;
  pieChartData?: Array<{ name: string; value: number }>;
  barChartData?: Array<{ name: string; value: number }>;
  appointmentStatusDistribution?: Array<{ status: string; count: number }>;
}
