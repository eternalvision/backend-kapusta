function calculateBalanceForAdd(balance, type, amount) {
    if (type === 'income') {
    return balance + amount
  }
  return balance - amount
};

module.exports = calculateBalanceForAdd;