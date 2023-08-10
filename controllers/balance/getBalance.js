const { NotFound } = require("http-errors");
const { Auth } = require("../../models");

const getBalance = async (req, res) => {
    const { _id } = req.user;
    const user = await Auth.findById(_id);
    if (!user) {
        throw new NotFound(`User with ${_id} not found`);
    }
    
    const { balance } = user;

    res.status(200).json({balance});
};

module.exports = getBalance;