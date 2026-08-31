"use client"

import { PlusIcon } from "lucide-react"
import SelectTags from "@/components/select/SelectTags"
import SelectTransactionMode from "@/components/select/SelectTransactionMode"
import { addExpense } from "@/lib/actions/transaction";
import { useActionState, useEffect, useState } from "react";
import { SelectOption } from "@/lib/types/ui/select";
import { toast } from "@/components/ui/toast";


const AddExpenseForm = () => {

    interface AddExpenseFormState {
        success: boolean
        error?: unknown
    }

    const initialState: AddExpenseFormState = {
        success: false
    }

    const [tags, setTags] = useState<SelectOption[]>([])

    const handleExpenseSubmit = (prevState: AddExpenseFormState, formData: FormData) => {
        try {
            const transactionPayload = Object.fromEntries(formData.entries())
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
        else if (state.error) toast.add({ type: "error", description: "Could not save expense" })
    }, [state])

    return <div className="mt-10 gap-4 sm:mx-auto sm:w-full flex flex-col justify-center p-10 rounded-2xl border">
        <div className="text-xl font-medium mb-4">
            Add Expense
        </div>

        <form id="newExpenseForm" action={addExpenseAction}>
            <div className="flex flex-col items-center justify-center w-full">
                <div className="form-body gap-8 grid sm:grid-cols-2 w-full">
                    <div className="form-input-group w-full">
                        <label htmlFor="transactionTitle" className="form-label block text-sm/6 font-medium text-gray-900"> Name </label>
                        <div className="mt-2">
                            <input id="transactionTitle" name="transactionTitle" type="transactionTitle" required
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>
                    <div className="form-input-group w-full">
                        <label htmlFor="amount" className="form-label block text-sm/6 font-medium text-gray-900"> Amount </label>
                        <div className="mt-2">
                            <input type="number" name="amount" id="amount" min={1} required
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>
                    <div className="form-input-group w-full">
                        <label htmlFor="transactionDate" className="form-label block text-sm/6 font-medium text-gray-900"> Date </label>
                        <div className="mt-2">
                            <input type="datetime-local" name="transactionDate" id="transactionDate" placeholder="Transaction date" required
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>
                    <div className="form-input-group w-full">
                        <label htmlFor="transactionMode" className="form-label block text-sm/6 font-medium text-gray-900"> Payment Method </label>
                        <div className="mt-2">
                            <SelectTransactionMode required
                                name="transactionMode"
                                id="transactionMode"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>
                    <div className="form-input-group w-full">
                        <label htmlFor="transactionTags" className="form-label block text-sm/6 font-medium text-gray-900"> Tags </label>
                        <div className="mt-2">
                            <SelectTags
                                options={tags}
                                onChange={(tags: SelectOption[]) => setTags(tags)}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>
                    <div className="form-input-group w-full">
                        <label htmlFor="recipient" className="form-label block text-sm/6 font-medium text-gray-900"> Recipient </label>
                        <div className="mt-2">
                            <input type="text" name="recipient" id="recipient" placeholder="Enter recipient name"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-8 w-full form-footer">
                    <button type="submit" disabled={pending}
                        className="flex w-full items-center justify-center max-w-sm px-3 py-1.5 text-sm/6 font-semibold shadow-xs bg-blue-500 hover:bg-blue-400 mx-auto rounded-md text-white cursor-pointer m-3 disabled:pointer-events-none disabled:opacity-50">
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Add Expense
                    </button>
                </div>
            </div>
        </form>
    </div>
}

export default AddExpenseForm
