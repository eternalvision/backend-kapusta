const { NotFound } = require('http-errors')
const { UserTransaction, Auth } = require("../../models");

const getReportTransactions = async (req, res) => {
  const { _id } = req.user
  const { year, month } = req.params;
  const monthNum = Number(month)
  const yearNum = Number(year)
  const user = await Auth.findById(_id)
  
  const incomeTransaction = await UserTransaction.aggregate([
    {
      $match: {
        owner: user._id,
        month: monthNum,
        year: yearNum,
        type: "income",
      },
    },
    {
      $group: {
        _id: {
          month: '$month',
          year: '$year',
          description: '$description',
          category: '$category',
          amount: '$amount',
        },
      },
    },

    {
      $project: {
        _id: 0,
        group: '$_id',
      },
    },
  ]);

  const income = incomeTransaction
    .map((item) => item.group.amount)
    .reduce((a, b) => a + b, 0)

  const consumptionTransaction = await UserTransaction.aggregate([
    {
      $match: {
        owner: user._id,
        month: monthNum,
        year: yearNum,
        type: "consumption",
      },
    },
    {
      $group: {
        _id: {
          month: '$month',
          year: '$year',
          description: '$description',
          category: '$category',
          amount: '$amount',
        },
      },
    },

    {
      $project: {
        _id: 0,
        group: '$_id',
      },
    },
  ]);

  const consumption = consumptionTransaction
    .map((item) => item.group.amount)
    .reduce((a, b) => a + b, 0)
  

  const sumByCategoryIncome = await UserTransaction.aggregate([
    {
      $match: {
        owner: user._id,
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
        owner: user._id,
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
  
  const sumDescriptionIncome = await UserTransaction.aggregate([
      {
        $match: {
          owner: user._id,
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
            description: '$description',
            type: '$type',
          },
          totalDescription: { $sum: '$amount' },
        },
      },

      {
        $project: {
          _id: 0,
          group: '$_id.description',
          totalDescription: 1,
        },
      },
  ])
  
  const sumDescriptionConsumption = await UserTransaction.aggregate([
      {
        $match: {
          owner: user._id,
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
            description: '$description',
            type: '$type',
          },
          totalDescription: { $sum: '$amount' },
        },
      },

      {
        $project: {
          _id: 0,
          group: '$_id.description',
          totalDescription: 1,
        },
      },
    ])
  
  res.json({
    status: "success",
    code: 200,
    income,
    consumption,
    incomeTransaction,
    consumptionTransaction,
    sumByCategoryIncome,
    sumByCategoryConsumption,
    sumDescriptionIncome,
    sumDescriptionConsumption
  });
};

module.exports = getReportTransactions;