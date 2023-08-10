const { NotFound } = require('http-errors')
const { UserTransaction, Auth } = require("../../models");

const getByCategory = async (req, res) => {
    const { year, month, category } = req.params;
    const { _id } = req.user;
    const monthNum = Number(month);
    const yearNum = Number(year);
    
    const sumByCategory = await UserTransaction.aggregate([
        {
            $match: {
                owner: _id,
                month: monthNum,
                year: yearNum,
                category: category,
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
    ]);
  
    res.json({
        status: "success",
        code: 200,
        year,
        month,
        sumByCategory
    });
};

module.exports = getByCategory;