export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  DOCTOR = "DOCTOR",
  PATIENT = "PATIENT",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
  DELETED = "DELETED",
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export enum AppointmentStatus {
  SCHEDULED = "SCHEDULED",
  INPROGRESS = "INPROGRESS",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
}

export enum PaymentStatus {
  PAID = "PAID",
  UNPAID = "UNPAID",
}

export enum BloodGroup {
  A_POSITIVE = "A_POSITIVE",
  A_NEGATIVE = "A_NEGATIVE",
  B_POSITIVE = "B_POSITIVE",
  B_NEGATIVE = "B_NEGATIVE",
  AB_POSITIVE = "AB_POSITIVE",
  AB_NEGATIVE = "AB_NEGATIVE",
  O_POSITIVE = "O_POSITIVE",
  O_NEGATIVE = "O_NEGATIVE",
}

export enum MaritalStatus {
  MARRIED = "MARRIED",
  UNMARRIED = "UNMARRIED",
  DIVORCED = "DIVORCED",
  WIDOWED = "WIDOWED",
}

export interface IUser {
  id?: string;
  email: string;
  name: string;
  role: Role;
  status: UserStatus;
  needPasswordChange?: boolean;
  image?: string;
  profilePhoto?: string;
  contactNumber?: string;
  address?: string;
  isDeleted?: boolean;
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ILoginResponse {
  token: string;
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

export interface IRegisterResponse {
  id: string;
  email: string;
  name: string;
  role: Role;
}