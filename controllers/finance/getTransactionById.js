const { NotFound } = require("http-errors");
const { UserTransaction } = require("../../models");

const getUserById = async (req, res) => {
  const { _id } = req.user;

  const result = await UserTransaction.find({
    owner: _id,
  }); 
  if (!result) {
    throw new NotFound(`User with ${_id} did't make any transactions`);
  }

  res.json({
    status: "success",
    code: 200,
    data: {
      result,
    },
  });
};

module.exports = getUserById;
