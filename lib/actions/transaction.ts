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
    transactionDate: z.coerce.date({ error: "Invalid date" }),
    tags: z.string().toLowerCase().trim()
        .array().transform(tags => [...new Set(tags.filter(Boolean))]).default([]).optional(),
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
        success: result.success,
        error: result.error,
        pretty: z.prettifyError(result.error),
        flat: z.flattenError(result.error),
        tree: z.treeifyError(result.error)
    }

    const transaction = new Transaction({
        userId: user._id,
        transactionType: TransactionTypeEnum.debit,
        ...(payload as TransactionPayload),
    })
    await transaction.save()

    return { success: true, data: result.data, message: "Expense saved successfully" }
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
    console.log(startDate.toLocaleString())

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
