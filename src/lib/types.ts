import { Types } from "mongoose";

export interface studentType {
  name: string;
  fatherName: string;
  motherName: string;
  address: string;
  mobileNumber: number;
  adhaarNumber: number;
  serialNumber: number;
  rollnumber: number;
  bloodGroup:
    | "A+"
    | "A−"
    | "B+"
    | "B−"
    | "AB+"
    | "AB−"
    | "O+"
    | "O−"
    | undefined;
  dob: Date;
  image_url: string;
  image_public_id: string;
}

export interface marksType {
  student_id: Types.ObjectId;
  class_id: Types.ObjectId;
  subject_id: string;
  max: number;
  obtained: number;
  examType: string;
  absent: boolean;
}

export interface asssignmentType {
  subject: string;
  title: string;
  description: string;
  attachment?: string;
}

export interface HomeworkType {
  date: Date;
  batch: number;
  class_id: Types.ObjectId;
  assignments: asssignmentType[];
}

export interface attendanceType {
  student_id: Types.ObjectId;
  class_id: Types.ObjectId;
  date: Date;
  present: boolean;
}
export interface ClassType {
  class_name: string;
  students: Types.ObjectId[];

  session: Types.ObjectId;
}

export interface announcementsType {
  title: string;
  description: string;
  date: Date;
  attachment?: string;
}

export interface admintype {
  name: string;
  number: number;
}
