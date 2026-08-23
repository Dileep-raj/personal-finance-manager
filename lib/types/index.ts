
export enum TransactionTypeEnum {
    debit = "debit",
    credit = "credit",
}
export type TransactionType = "debit" | "credit"

export enum PaymentMethodEnum {
    cash = "cash",
    debitcard = "debitcard",
    creditcard = "creditcard",
    upi = "upi",
}
export type PaymentMethod = "cash" | "debitcard" | "creditcard" | "upi"
