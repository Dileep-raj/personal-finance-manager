import mongoose, { Document, ObjectId } from "mongoose";
import bcrypt from "bcryptjs";
import { PaymentMethodEnum, TransactionTypeEnum, type TransactionType } from "@/lib/types";


export interface ITransaction extends Document {
    userId: ObjectId;
    amount: number;
    transactionTitle: string;
    transactionType: TransactionType;
    transactionDate: Date;
    transactionMode: PaymentMethodEnum;
    tags?: Array<string>;
    receiver?: string
}

const transactionSchema = new mongoose.Schema<ITransaction>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "User id is required"],
            ref: 'User'
        },
        amount: {
            type: Number,
            required: [true, "is required"],
            min: [0, "Invalid amount"],
            max: [1000000000, "Invalid amount"],
        },
        transactionTitle: {
            type: String,
            required: [true, "Transaction title is required"],
        },
        transactionType: {
            type: String,
            enum: Object.values(TransactionTypeEnum),
            required: [true, "Transaction type is required"],
        },
        transactionDate: {
            type: Date,
            required: [true, "Transaction date is required"],
        },
        transactionMode: {
            type: String,
            enum: Object.values(PaymentMethodEnum),
            required: [true, "Transaction mode is required"]
        },
        tags: {
            type: [String],
            default: [],
            set: (tags: string[]) => [...new Set(tags.map(tag => tag.trim().toLowerCase()).filter(Boolean))],
            validate: [
                {
                    validator: (tags: string[]) => tags.length <= 10,
                    message: "Maximum 10 tags allowed",
                },
                {
                    validator: (tags: string[]) => tags.every(tag => tag.length <= 30),
                    message: "Each tag must be at most 30 characters",
                },
            ],
        }
    },
    { timestamps: true },
);

transactionSchema.index({
    userId: 1,
    accountId: 1,
    transactionDate: -1,
});

// transactionSchema.pre("save", function () {
// })

// Validate password
transactionSchema.methods.validPassword = function (password: string) {
    return bcrypt.compareSync(password, this.password);
};

const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);

export default Transaction;
