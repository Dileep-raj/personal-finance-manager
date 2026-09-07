"use client"

import { PlusIcon } from "lucide-react"
import SelectTags from "@/components/select/SelectTags"
import SelectTransactionMode from "@/components/select/SelectTransactionMode"
import { addExpense } from "@/lib/actions/transaction";
import { useActionState, useEffect, useState } from "react";
import { toast } from "@/components/ui/toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AddExpenseForm = () => {

    interface AddExpenseFormState {
        success: boolean
        error?: unknown
    }

    const initialState: AddExpenseFormState = {
        success: false
    }

    const [tags, setTags] = useState<string[]>([])

    const handleExpenseSubmit = (prevState: AddExpenseFormState, formData: FormData) => {
        try {
            const transactionPayload = Object.fromEntries(formData.entries())
            transactionPayload.tags = tags
            return addExpense(transactionPayload)
        }
        catch (error) {
            console.error(error)
            return { success: false, error: error }
        }
    }

    const [state, addExpenseAction, pending] = useActionState(handleExpenseSubmit, initialState)

    useEffect(() => {
        if (state.success) toast.add({ type: "success", description: "Expense added successfully" })
        else if (state.error) {
            toast.add({ type: "error", description: "Could not save expense" })
            console.error(state)
        }
    }, [state])

    return <Card className="w-full p-6">
        <CardHeader>
            <CardTitle>Add Expense</CardTitle>
        </CardHeader>
        <CardContent>
            <form id="newExpenseForm" action={addExpenseAction}>
                <FieldGroup>
                    <div className="gap-8 grid sm:grid-cols-2 w-full">
                        <Field>
                            <FieldLabel htmlFor="transactionTitle">Name</FieldLabel>
                            <Input id="transactionTitle" name="transactionTitle" type="transactionTitle" required />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="amount">Amount</FieldLabel>
                            <Input type="number" name="amount" id="amount" min={1} required />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="transactionDate">Date</FieldLabel>
                            <Input type="datetime-local" name="transactionDate" id="transactionDate" placeholder="Transaction date" required />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="transactionMode">Payment Method</FieldLabel>
                            <SelectTransactionMode name="transactionMode" id="transactionMode" required />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="transactionTags">Tags</FieldLabel>
                            <SelectTags id="transactionTags" onChange={setTags} />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="receiver">Recipient</FieldLabel>
                            <Input type="text" name="receiver" id="receiver" placeholder="Enter recipient name" />
                        </Field>
                    </div>
                    <Field className="flex justify-center items-center mt-4">
                        <Button type="submit" disabled={pending} className="max-w-sm">
                            <PlusIcon className="h-5 w-5 mr-2" data-icon="inline-end" />
                            Add Expense
                        </Button>
                    </Field>
                </FieldGroup>
            </form>
        </CardContent>
    </Card>
}

export default AddExpenseForm
