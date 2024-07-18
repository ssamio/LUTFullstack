//The main API routes for the application
var express = require("express");
var router = express.Router();
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const User = require("../models/User");
const Expense = require("../models/Expense");

const textValidate = () => body("text").isString().exists().trim().bail();
const titleValidate = () => body("title").isString().exists().trim().bail();
const sumValidate = () => body("sum").isNumeric().exists().bail();
const budgetValidate = () => body("budget").isNumeric().exists().bail();
const usernameValidate = () =>
  body("username").isString().exists().trim().bail();

//AdminStatus used in methods is for testing purposes, not implemented nor used in the app

//GET all expenses that exist per user
router.get(
  "/expense",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const expenses = await Expense.find({ user: req.user.id });
    if (expenses) {
      res.send(expenses);
    } else {
      res.status(404).json({ error: "Expenses not found" });
    }
  },
);

//GET user expenses for the current month
router.get(
  "/expense/month",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      );

      const expenses = await Expense.find({
        user: req.user.id,
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
      });

      if (expenses.length > 0) {
        res.send(expenses);
      } else {
        res
          .status(404)
          .json({ error: "No expenses found for the current month" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while fetching expenses" });
    }
  },
);

//POST for new expense
router.post(
  "/expense",
  sumValidate(),
  titleValidate(),
  textValidate(),
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    //Validate content
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: "Invalid content" });
    }
    try {
      const { title, text, sum, repeating } = req.body;
      const expense = new Expense({
        title: title,
        text: text,
        sum: sum,
        user: req.user.id,
      });
      expense.save();
      return res.status(200).json({ message: "Expense created!" });
    } catch (error) {
      return res.status(500).json({ error: "Failed to create expense!" });
    }
  },
);

//DELETE for expense
router.delete(
  "/expense/:expenseId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      Expense.findById(req.params.expenseId).then((expense) => {
        if (!expense) {
          return res.status(404).json({ error: "Expense not found" });
        }

        if (expense.user.equals(req.user.id) || req.user.adminStatus === true) {
          expense.deleteOne().exec();
          return res.status(200).json({ message: "Expense deleted!" });
        } else {
          return res.status(403).json({ error: "You are not the owner!" });
        }
      });
    } catch (error) {
      res.status(500).json({ error: "Deleting expense failed!" });
    }
  },
);

//PUT for expense
router.put(
  "/expense/:expenseId",
  sumValidate(),
  titleValidate(),
  textValidate(),
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    //Validate content
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: "Invalid content" });
    }
    try {
      Expense.findById(req.params.expenseId).then((expense) => {
        if (!expense) {
          return res.status(404).json({ error: "Expense not found" });
        }
        const { title, text, sum, repeating } = req.body;
        if (expense.user.equals(req.user.id) || req.user.adminStatus === true) {
          expense
            .updateOne({
              title: title,
              text: text,
              sum: sum,
            })
            .exec();
          return res.status(200).json({ message: "Expense updated!" });
        } else {
          return res.status(403).json({ error: "You are not the owner!" });
        }
      });
    } catch (error) {
      res.status(500).json({ error: "Updating expense failed!" });
    }
  },
);

//UPDATE for user
router.put(
  "/user",
  usernameValidate(),
  budgetValidate(),
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    //Validate content
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: "Invalid content" });
    }
    try {
      const targetUser = await User.findById(req.user.id);
      if (!targetUser) {
        return res.status(404).json({ error: "User not found" });
      }
      const budget = req.body.budget;
      const username = req.body.username;
      // Check for duplicate usernames
      const existingUser = await User.findOne({ username: username });
      if (existingUser && existingUser.id !== req.user.id) {
        return res.status(400).json({ error: "Username is already taken" });
      }
      targetUser.updateOne({ username: username, budget: budget }).exec();
      return res.status(200).json({
        message: "User updated!",
      });
    } catch (error) {
      res.status(500).json({ error: "Updating user failed!" });
    }
  },
);

//GET user
router.get(
  "/user",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const tokenUserId = req.user.id;
      User.findById(tokenUserId).then((targetUser) => {
        if (!targetUser) {
          return res.status(404).json({ error: "User not found" });
        } else {
          res
            .status(200)
            .json({ username: targetUser.username, budget: targetUser.budget });
        }
      });
    } catch (error) {
      res.status(500).json({ error: "Error" });
    }
  },
);

//DELETE for user
router.delete(
  "/user",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const targetUser = await User.findById(req.user.id);
      if (!targetUser) {
        return res.status(404).json({ error: "User not found" });
      }
      if (targetUser._id.equals(req.user.id) || req.user.adminStatus === true) {
        //Delete user
        targetUser.deleteOne().exec();

        //Delete all expenses the user has made
        Expense.deleteMany({ user: targetUser._id }).exec();

        return res.status(200).json({ message: "User deleted. Goodbye! :)" });
      } else {
        return res.status(403).json({ error: "You are not authorized" });
      }
    } catch (error) {
      res.status(500).json({ error: "Deleting user failed!" });
    }
  },
);
module.exports = router;
