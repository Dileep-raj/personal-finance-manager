"use client"

import { PlusIcon } from "lucide-react"
import SelectTags from "@/components/select/SelectTags"
import SelectTransactionMode from "@/components/select/SelectTransactionMode"
import { addExpense, AddExpenseFormState } from "@/lib/actions/transaction";
import { useActionState, useEffect } from "react";
import { toast } from "@/components/ui/toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaymentMethodEnum } from "@/lib/types";
import { Kbd } from "@/components/ui/kbd";

const AddExpenseForm = () => {

    const initialState: AddExpenseFormState = {
        success: false,
        data: {
            amount: 0,
            transactionTitle: "",
            transactionMode: PaymentMethodEnum.cash,
            tags: [],
            transactionDate: new Date(),
            receiver: ""
        }
    }

    const [state, addExpenseAction, pending] = useActionState(addExpense, initialState)

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
                            <FieldError>{state.properties?.transactionTitle?.errors?.[0]}</FieldError>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="amount">Amount</FieldLabel>
                            <Input className="no-spinner" type="number" name="amount" id="amount" min={1} required />
                            <FieldError>{state.properties?.amount?.errors?.[0]}</FieldError>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="transactionDate">Date</FieldLabel>
                            <Input type="datetime-local" name="transactionDate" id="transactionDate" placeholder="Transaction date" required />
                            <FieldError>{state.properties?.transactionDate?.errors?.[0]}</FieldError>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="transactionMode">Payment Method</FieldLabel>
                            <SelectTransactionMode name="transactionMode" id="transactionMode" required />
                            <FieldError>{state.properties?.transactionMode?.errors?.[0]}</FieldError>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="tags">Tags</FieldLabel>
                            <SelectTags name="tags" id="tags" />
                            <FieldDescription>Type a tag and press <Kbd>Enter</Kbd> or <Kbd>,</Kbd> to add it</FieldDescription>
                            <FieldError>{state.properties?.tags?.errors?.[0]}</FieldError>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="receiver">Recipient</FieldLabel>
                            <Input type="text" name="receiver" id="receiver" placeholder="Enter recipient name" />
                            <FieldError>{state.properties?.receiver?.errors?.[0]}</FieldError>
                        </Field>
                    </div>
                    <Field orientation="horizontal" className="flex justify-center items-center mt-4">
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
