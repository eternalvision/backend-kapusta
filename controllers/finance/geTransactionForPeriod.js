const { NotFound } = require('http-errors');
const { UserTransaction } = require("../../models");

const geTransactionForPeriod = async (req, res) => {
  const { type, year } = req.params;
  const { _id } = req.user;
  const result = await UserTransaction.find({
    owner: _id,
    type,
    year
  });
  const yearArray = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  ];
  let total = 0;
  let summary = [];
  
  if (result.length === 0) {
    throw new NotFound(
      `No one ${type} transaction for ${year} year`
    )
  }

  result.map(res => {
    yearArray[res.month - 1] += res.amount;
    total += res.amount;
  });
  
  yearArray.map((sum, index) => {
    summary[index] = { monthIdex: index + 1,  value: sum };
  });
  
  res.json({
    status: "success",
    code: 200,
    type,
    year,
    total,
    summary
  });
};

module.exports = geTransactionForPeriod;