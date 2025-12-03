export const TOKEN_COOKIE_NAME = process.env.NEXT_PUBLIC_TOKEN_COOKIE_NAME || '';

export const TOKEN_EXPIRATION_DAYS = Number(process.env.NEXT_PUBLIC_TOKEN_EXPIRATION_DAYS || '7');

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export const DEFAULT_PAGE_SIZE = 10;

export enum AccountPeriodType {
  Monthly = 1,
  Quarterly = 2,
  SemiAnnual = 3,
  Yearly = 4,
}

export const AccountPeriodTypeLabels: Record<AccountPeriodType, string> = {
  [AccountPeriodType.Monthly]: '月次',
  [AccountPeriodType.Quarterly]: '四半期',
  [AccountPeriodType.SemiAnnual]: '半期',
  [AccountPeriodType.Yearly]: '年次',
};
