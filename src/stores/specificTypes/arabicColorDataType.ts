export interface ArabicColorDataType {
  data: Datum[];
  meta: Meta;
}

export interface Localizations {
  data: Datum[];
}

export interface Attributes {
  name: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  hex: string;
  locale: string;
  localizations?: Localizations;
}

export interface Datum {
  id: number;
  attributes: Attributes;
}

export interface Meta {
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}
