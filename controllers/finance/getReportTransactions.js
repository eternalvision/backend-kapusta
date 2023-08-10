const { NotFound } = require('http-errors')
const { UserTransaction, Auth } = require("../../models");

const getReportTransactions = async (req, res) => {
  const { _id } = req.user
  const { year, month } = req.params;
  const monthNum = Number(month);
  const yearNum = Number(year);
  
  const incomeTransaction = await UserTransaction.aggregate([
    {
      $match: {
        owner: _id,
        month: monthNum,
        year: yearNum,
        type: "income",
      },
    },
    {
      $group: {
                _id: null,              
                income: { $sum: '$amount' }
            }
    },
    {
      $project: {
        _id: 0,
         income: "$income"
      },
    },
  ]);

  const consumptionTransaction = await UserTransaction.aggregate([
    {
      $match: {
        owner: _id,
        month: monthNum,
        year: yearNum,
        type: "consumption",
      },
    },
    {
      $group: {
                _id: null,              
                consumption: { $sum: '$amount' }
            }
    },
    {
      $project: {
        _id: 0,
         consumption: "$consumption"
      },
    },
  ]);

  const sumByCategoryIncome = await UserTransaction.aggregate([
    {
      $match: {
        owner: _id,
        month: monthNum,
        year: yearNum,
        type: 'income',
      },
    },
    {
      $group: {
        _id: {
          month: '$month',
          year: '$year',
          category: '$category',
        },
        totalCategory: { $sum: '$amount' },
      },
    },

    {
      $project: {
        _id: 0,
        group: '$_id.category',
        totalCategory: 1,
      },
    },
  ]);

  const sumByCategoryConsumption = await UserTransaction.aggregate([
    {
      $match: {
        owner: _id,
        month: monthNum,
        year: yearNum,
        type: 'consumption',
      },
    },
    {
      $group: {
        _id: {
          month: '$month',
          year: '$year',
          category: '$category',
        },
        totalCategory: { $sum: '$amount' },
      },
    },

    {
      $project: {
        _id: 0,
        group: '$_id.category',
        totalCategory: 1,
      },
    },
  ]);
  
  res.json({
    status: "success",
    code: 200,
    incomeTransaction,
    consumptionTransaction,
    sumByCategoryIncome,
    sumByCategoryConsumption,
  });
};

module.exports = getReportTransactions;