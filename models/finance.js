const { Schema, model } = require("mongoose");
const Joi = require("joi");

const category = [
  "alcohol",
  "activities",
  "transport",
  "food",
  "utility_bills",
  "home_stuff",
  "gadgets",
  "education",
  "health",
  "others",
  "hobbies",
  "salary",
  "additional-income",
];

const transactionSchema = Schema(
  {
    type: {
      type: String,
      required: [true, "Enter the type"],
      enum: ["income", "consumption"],
    },
    category: {
      type: String,
      required: [true, "Enter transaction consumption"],
      enum: category,
    },
    description: {
      type: String,
      required: [true, "Enter a description of the transaction"],
    },
    amount: {
      type: Number,
      required: [true, "Enter transaction amount"],
      min: 0,
    },
    day: {
      type: Number,
      required: [true, "Enter the date"],
      minLength: 1,
      maxLength: 2,
    },
    month: {
      type: Number,
      required: [true, "Enter the date"],
      minLength: 1,
      maxLength: 2,
    },
    year: {
      type: Number,
      required: [true, "Enter the date"],
      minLength: 4,
      maxLength: 4,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "auth",
      required: true,
    },
    createdAt_ms: {
      type: String,
      default: () => Date.now(),
    },
  },

  {
    versionKey: false,
    timestamps: true,
  }
);

const joiSchemaTransaction = Joi.object({
  type: Joi.string().required().valid("income", "consumption"),
  description: Joi.string().required(),
  amount: Joi.number().required(),
  category: Joi.string()
    .required()
    .valid(...category),
  subcategory: Joi.string(),
  day: Joi.string().required().min(1).max(2),
  month: Joi.string().required().min(1).max(2),
  year: Joi.string().required().min(4).max(4),
});

const UserTransaction = model("transaction", transactionSchema);

module.exports = {
  UserTransaction,
  joiSchemaTransaction,
};
