"use server";

import { z } from "zod";
import { PaymentMethodEnum, TransactionTypeEnum } from "@/lib/types";
import { cookies } from "next/headers";
import { getSessionUsername } from "@/lib/actions/session";
import { getUserByUsername } from "@/lib/actions/user";
import Transaction from "@/lib/mongodb/models/transaction.model";

const transactionPayloadSchema = z.object({
    amount: z.coerce.number({ error: "Amount must be a number" })
        .gt(0, { error: "Amount must be greater than 0" })
        .lt(1000000000, { error: "Maximum amount is 1000000000" }),
    transactionTitle: z.string().trim().nonempty({ error: "Invalid title" }),
    transactionMode: z.enum(PaymentMethodEnum, { error: "Invalid payment method" }),
    transactionDate: z.date({ error: "Invalid date" }),
    tags: z.string().toLowerCase().trim().array().transform(tags => [...new Set(tags.filter(Boolean))]),
    receiver: z.string().optional()
})
export type TransactionPayload = z.infer<typeof transactionPayloadSchema>

export const addExpense = async (payload: unknown) => {
    const username = await getSessionUsername(await cookies())
    if (!username) return { success: false, error: "Invalid request" }
    const user = await getUserByUsername(username)
    if (!user) return { success: false, error: "Invalid request" }
    const result = transactionPayloadSchema.safeParse(payload)

    if (!result.success) return {
        error: result.error,
        pretty: z.prettifyError(result.error),
        flat: z.flattenError(result.error),
        tree: z.treeifyError(result.error)
    }

    const transaction = new Transaction({
        ...(payload as TransactionPayload),
        transactionType: TransactionTypeEnum.debit,
        userId: user._id
    })
    console.log("Transaction created", transaction)

    return { success: true, data: result.data, message: "Expense saved successfully" }
}
