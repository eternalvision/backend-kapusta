function calculateBalanceForRemove(balance, type, amount) {
    if (type === 'income') {
    return balance - amount
  }
  return balance + amount
};

module.exports = calculateBalanceForRemove;