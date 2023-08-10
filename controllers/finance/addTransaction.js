const { NotFound } = require("http-errors");
const { removeZeroString, calculateBalanceForAdd } = require("../../helpers");
const { UserTransaction, Auth } = require("../../models");

const addUserTransaction = async (req, res) => {
  const { _id, balance } = req.user;

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
  if (!newTransaction) {
    throw new NotFound(`User with ${_id} not found`);
  };

  const currentBalance = calculateBalanceForAdd(balance, type, amount);
  const userWithUpdatedBalance = await Auth.findByIdAndUpdate(_id, { balance: currentBalance }, { new: true });

  res.json({
    status: "success",
    code: 200,
    data: {
      newTransaction,
      balance: userWithUpdatedBalance.balance,
    }
  });
};

module.exports = addUserTransaction;
