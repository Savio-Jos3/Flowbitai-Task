// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

// Invoice types
export interface Invoice {
  id: string;
  invoiceNumber: string;
  vendorId: string;
  customerId: string;
  invoiceDate: string;
  deliveryDate: string | null;
  invoiceTotal: number;
  status: string;
  documentId: string | null;
}

export interface InvoiceListResponse {
  invoices: Invoice[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Analytics types
export interface Stats {
  invoiceCount: number;
}

export interface MonthlyTrend {
  month: string;
  count: number;
  sum: number;
}

export interface VendorSpend {
  vendorId: string;
  _sum: {
    invoiceTotal: number;
  };
}

export interface CashOutflow {
  paymentDate: string | null;
  _sum: {
    amount: number;
  };
}

export interface CategorySpend {
  sachkonto: string;
  _sum: {
    totalPrice: number;
  };
}

// Auth types
export interface User {
  userId: string;
  email: string;
  name: string;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name?: string;
}
