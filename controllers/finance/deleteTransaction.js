const { UserTransaction } = require("../../models");

const { NotFound } = require("http-errors");

const deleteTransaction = async (req, res) => {
  const { id } = req.params;
  const result = await UserTransaction.findByIdAndRemove({ _id: id });

  if (!result) {
    throw new NotFound(`Transaction not found`);
  }

  res.json({
    status: "success",
    code: 200,
    message: "transaction deleted",
    result,
  });
};

module.exports = deleteTransaction;
