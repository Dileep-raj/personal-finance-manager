
export interface CommonResponse {
    success: boolean
    message?: string
    error?: string
    data?: unknown
}

export enum TransactionTypeEnum {
    debit = "debit",
    credit = "credit",
}

export enum PaymentMethodEnum {
    cash = "cash",
    debitcard = "debitcard",
    creditcard = "creditcard",
    upi = "upi",
}
