"use server";

import { z } from "zod";
import { CommonResponse, PaymentMethodEnum, TransactionTypeEnum } from "@/lib/types";
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
    transactionDate: z.coerce.date({ error: "Invalid date" }),
    tags: z.string({ error: "Invalid tags" }).toLowerCase().trim().max(20, { error: "Tag must be 20 characters or less" })
        .array().transform(tags => [...new Set(tags.filter(Boolean))]).default([]).optional(),
    receiver: z.string().optional()
})
export type TransactionPayload = z.infer<typeof transactionPayloadSchema>

export interface AddExpenseFormState extends Partial<ReturnType<typeof z.treeifyError<TransactionPayload>>>, CommonResponse {
    data?: TransactionPayload
}

export const addExpense = async (prevState: AddExpenseFormState, formData: FormData): Promise<AddExpenseFormState> => {
    const username = await getSessionUsername(await cookies())
    if (!username) return { success: false, error: "Invalid request" }
    const user = await getUserByUsername(username)
    if (!user) return { success: false, error: "Invalid request" }

    const transactionPayload = {
        amount: formData.get("amount"),
        transactionTitle: formData.get("transactionTitle"),
        transactionMode: formData.get("transactionMode"),
        transactionDate: formData.get("transactionDate"),
        tags: formData.getAll("tags"),
        receiver: formData.get("receiver")
    }

    const result = transactionPayloadSchema.safeParse(transactionPayload)

    if (!result.success) return {
        success: result.success,
        ...z.treeifyError(result.error)
    }

    const transaction = new Transaction({
        userId: user._id,
        transactionType: TransactionTypeEnum.debit,
        ...result.data,
    })
    await transaction.save()

    return { success: true, data: result.data }
}

export const getTransactionsFromLast30Days = async (timezone: string) => {
    const username = await getSessionUsername(await cookies())
    if (!username) return { success: false, error: "Invalid request" }
    const user = await getUserByUsername(username)
    if (!user) return { success: false, error: "Invalid request" }

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 30)
    startDate.setHours(0, 0, 0, 0)
    const endDate = new Date()

    const transactions = await Transaction.aggregate([
        {
            $match: {
                userId: user._id,
                transactionDate: {
                    $gte: startDate,
                    $lte: endDate
                }
            }
        },
        {
            $group: {
                _id: {
                    date: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$transactionDate",
                            timezone
                        }
                    }
                },
                credit: {
                    $sum: {
                        $cond: [
                            { $eq: ["$transactionType", "credit"] },
                            "$amount",
                            0
                        ]
                    }
                },
                debit: {
                    $sum: {
                        $cond: [
                            { $eq: ["$transactionType", "debit"] },
                            "$amount",
                            0
                        ]
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                date: "$_id.date",
                credit: 1,
                debit: 1
            }
        }
    ])

    const transactionsMap = new Map(transactions.map(t => [t.date, { credit: t.credit, debit: t.debit }]))

    const allTransactions = Array.from({ length: 30 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (29 - i))
        const dateString = date.toISOString().split("T")[0]
        return {
            date: dateString,
            credit: transactionsMap.get(dateString)?.credit ?? 0,
            debit: transactionsMap.get(dateString)?.debit ?? 0,
        }
    })

    return { success: true, data: allTransactions }
}
