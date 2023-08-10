const { removeZeroString } = require("../../helpers");
const { UserTransaction } = require("../../models");

const addUserTransaction = async (req, res) => {
  const { _id } = req.user;

  const { type, description, amount, category, day, month, year } = req.body;
  
  const transaction = {
    type,
    category,
    description,
    amount,
    day: removeZeroString(day),
    month: removeZeroString(month),
    year,
  };

  const newTransaction = await UserTransaction.create({
    ...transaction,
    owner: _id,
  });

  console.log(newTransaction);
  res.json({
    status: "success",
    code: 200,
    data: newTransaction,
  });
};

module.exports = addUserTransaction;
