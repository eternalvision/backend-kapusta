const { NotFound } = require("http-errors");
const { UserTransaction } = require("../../models");

const getAllBySomeTime = async (req, res) => {
  const { month, year, type } = req.params;
  const { _id } = req.user;

  const result = await UserTransaction.find(
    { owner: _id, month, year, type },
    { _id: 0, type: 0, day: 0, month: 0, year: 0, owner: 0, createdAt_ms: 0, createdAt: 0, updatedAt: 0 }
  ).sort({
    amount: -1,
  });

  if (!result) {
    throw new NotFound("Sign in!");
  }

  res.json({
    status: "success",
    code: 200,
    result,
  });
};

module.exports = getAllBySomeTime;
