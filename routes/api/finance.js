const express = require("express");

const { validation, ctrlWrapper, auth } = require("../../middlewares");

const { joiSchemaTransaction } = require("../../models/finance");

const { joiBalanceSchema } = require("../../models/auth");

const { finance: ctrl, balance: ctrlBalance } = require("../../controllers");

const router = express.Router();

//TODO Добавление транзакции
router.post("/", auth, validation(joiSchemaTransaction), ctrlWrapper(ctrl.addTransaction));

//TODO Обновление баланса по id
router.put("/balance", auth, validation(joiBalanceSchema), ctrlWrapper(ctrlBalance.updateBalance));

//TODO Вывод баланса по id
router.get("/getBalance", auth, ctrlWrapper(ctrlBalance.getBalance));

//TODO Вывод транзакций owner
router.get("/", auth, ctrlWrapper(ctrl.getTransactionById));

//TODO Вывод транзакций для сводки
router.get("/summary/:type/:year", auth, ctrlWrapper(ctrl.geTransactionForPeriod));

//TODO Вывод транзакций последний эндпоинт
router.get("/period/:month/:year/:type", auth, ctrlWrapper(ctrl.getAllBySomeTime));

//TODO Вывод транзакций по типу
router.get("/type/:type", auth, ctrlWrapper(ctrl.getAllByType));

//TODO Вывод отчета по транзакциям
router.get("/report/:year/:month", auth, ctrlWrapper(ctrl.getReportTransactions));

//TODO Удаление транзакций id
router.delete("/:id", auth, ctrlWrapper(ctrl.deleteTransaction));

//TODO Вывод транзакций по категориям
router.get("/category/:month/:year/:category", auth, ctrlWrapper(ctrl.getByCategory));

module.exports = router;
