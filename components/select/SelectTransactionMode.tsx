"use client"

import { PaymentMethodEnum } from "@/lib/types";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";

interface PaymentMethodOption {
    readonly value: keyof typeof PaymentMethodEnum
    readonly label: string
    readonly color?: string;
    readonly isFixed?: boolean;
    readonly isDisabled?: boolean;
}

const paymentMethodOptions: readonly PaymentMethodOption[] = [
    { value: "cash", label: "Cash" },
    { value: "debitcard", label: "Debit Card" },
    { value: "creditcard", label: "Credit Card" },
    { value: "upi", label: "UPI" }
]

interface SelectTransactionModeProps {
    name?: string;
    id?: string;
    disabled?: boolean
    required?: boolean
    items?: readonly PaymentMethodOption[]
}

const SelectTransactionMode = (props: SelectTransactionModeProps) => {
    return (
        <Combobox
            name={props.name ?? "transactionMode"}
            id={props.id ?? "transactionMode"}
            disabled={props.disabled ?? false}
            items={props.items ?? paymentMethodOptions}
            required={props.required ?? true}
            itemToStringLabel={(paymentMethod: PaymentMethodOption) => paymentMethod.label}>
            <ComboboxInput placeholder="Select Payment Method" />
            <ComboboxContent>
                <ComboboxEmpty>No payment methods found</ComboboxEmpty>
                <ComboboxList>
                    {
                        (paymentMethod: PaymentMethodOption) => <ComboboxItem key={paymentMethod.value} value={paymentMethod}>
                            {paymentMethod.label}
                        </ComboboxItem>
                    }
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    )
}

export default SelectTransactionMode
