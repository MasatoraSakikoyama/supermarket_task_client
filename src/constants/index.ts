export enum AccountPeriodType {
  Monthly = 1,
  Quarterly = 2,
  SemiAnnual = 3,
  Yearly = 4,
}

export const AccountPeriodTypeLabels = {
  [AccountPeriodType.Monthly]: '月次',
  [AccountPeriodType.Quarterly]: '四半期',
  [AccountPeriodType.SemiAnnual]: '半期',
  [AccountPeriodType.Yearly]: '年次',
};
