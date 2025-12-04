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

export enum AccountTitleType {
    Revenue = 1
    Expense = 2
}

export const AccountTitleTypeLabels: Record<AccountTitleType, string> = {
    [AccountTitleType.Revenue]: '収益',
    [AccountTitleType.Expense]: '費用',
}

export enum AccountTitleSubType {
    Sales = 1
    NonOperatingRevenue = 2 
    ExtraordinaryIncome = 3
    CostOfGoodsSold = 100
    SellingGeneralAdministrativeExpense = 101
    NonOperatingExpense = 102
    ExtraordinaryLoss = 103
}

export const AccountTitleSubTypeLabels: Record<AccountTitleSubType, string> = {
    [AccountTitleSubType.Sales]: '売上',
    [AccountTitleSubType.NonOperatingRevenue]: '営業外収益',
    [AccountTitleSubType.ExtraordinaryIncome]: '特別利益',
    [AccountTitleSubType.CostOfGoodsSold]: '売上原価',
    [AccountTitleSubType.SellingGeneralAdministrativeExpense]: '販売費及び一般管理費',
    [AccountTitleSubType.NonOperatingExpense]: '営業外費用',
    [AccountTitleSubType.ExtraordinaryLoss]: '特別損失',
}
