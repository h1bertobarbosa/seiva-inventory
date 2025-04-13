export interface StockUsedOutput {
  id: string;
  description: string;
  quantity: number;
}

export interface SessionOutput {
  id: string;
  description: string;
  sessionDate: Date;
  masterDriver: string;
  masterSupport: string;
  quantityUsed: number;
  quantityLeft: number;
}

export interface PaginatedSessionOutput {
  data: SessionOutput[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
