"use client"

import { PaymentMethod } from "@/lib/types";
import { useId } from "react";
import Select from "react-select";

interface PaymentMethodOption {
    readonly value: PaymentMethod
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

const SelectTransactionMode = ({ ...props }: any) => {
    return (
        <Select
            {...props}
            className="basic-single"
            classNamePrefix="select"
            placeholder="Select Payment Method"
            defaultValue={paymentMethodOptions[0]}
            isClearable={true}
            isMulti={false}
            isSearchable={true}
            options={paymentMethodOptions}
            instanceId={useId()}
            styles={{
                
            }}
        />
    )
}

export default SelectTransactionMode
