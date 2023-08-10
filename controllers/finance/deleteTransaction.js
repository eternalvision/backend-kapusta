const { UserTransaction, Auth } = require("../../models");
const { calculateBalanceForRemove } = require("../../helpers");
const { NotFound } = require("http-errors");

const deleteTransaction = async (req, res) => {
  const { id } = req.params;
  const { _id, balance } = req.user;

  const {
    type,
    description,
    amount,
    day,
    month,
    year
  } = await UserTransaction.findByIdAndRemove({ _id: id });
  if (!type) {
    throw new NotFound(`Transaction not found`);
  }
  
  const currentBalance = calculateBalanceForRemove(balance, type, amount);
  const userWithUpdatedBalance = await Auth.findByIdAndUpdate(_id, { balance: currentBalance }, { new: true });

  res.json({
    status: "success",
    code: 200,
    message: "transaction deleted",
    balance: userWithUpdatedBalance.balance,
    type,
    description,
    amount,
    day,
    month,
    year
  });
};

module.exports = deleteTransaction;
