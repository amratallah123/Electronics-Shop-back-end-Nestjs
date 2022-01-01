import { MulterField } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";

export interface anyClass {
  new (...args: any[]): {}
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  CUSTOMER = 'customer',
}

export enum AccountStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  DISABLED = 'disabled',
  CLOSED = 'closed',
}

export enum CartState {
  PENDING = 'pending',
  SUBMITTED = 'submitted',
  IN_PROGRESS = 'in-progress',
  SHIPPED = 'shipped',
}
export enum updateCartByAdmin {
  IN_PROGRESS = 'in-progress',
  SHIPPED = 'shipped',
}

export enum ListType {
  ANY = 'any',
  EXISTED = 'existed',
  DELETED = 'deleted',
}
export interface PageResult {
  pageItems: any[]
  totalPages: number
  totalItems: number
}
export interface ApiResponse {
  statusCode: number
  status: string
  message: string
}

export type UploadFields = MulterField & { required?: boolean }
