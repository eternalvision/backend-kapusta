const { NotFound } = require("http-errors");
const { UserTransaction } = require("../../models");

const getAllByType = async (req, res) => {
  const { type } = req.params;
  const { _id } = req.user;

  const result = await UserTransaction.find({ owner: _id, type });

  if (!result) {
    throw new NotFound("Sign in!");
  }

  res.json({
    status: "success",
    code: 200,
    result,
  });
};

module.exports = getAllByType;
