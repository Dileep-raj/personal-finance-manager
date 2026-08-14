import mongoose, { Document, ObjectId } from "mongoose";
import bcrypt from "bcryptjs";
import type { PaymentMethod, TransactionType } from "@/lib/types";


export interface ITransaction extends Document {
    userId: ObjectId;
    amount: number;
    transactionType: TransactionType;
    transactionDate: Date;
    transactionMode: PaymentMethod;
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
            required: true,
            min: [0, "Invalid amount"],
            max: [1000000000, "Invalid amount"],
            allowNull: false
        },
        transactionType: {
            required: true,
            allowNull: false
        },
        transactionDate: {
            required: true,
            allowNull: false
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

const User = mongoose.models.User || mongoose.model("User", transactionSchema);

export default User;
