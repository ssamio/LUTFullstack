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
const repeatValidate = () => body("repeating").isBoolean().exists().bail();
const budgetValidate = () => body("budget").isNumeric().exists().bail();
const usernameValidate = () =>
  body("username").isString().exists().trim().bail();

//GET all expenses that exist per user
router.get(
  "/expenses",
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

//POST for new expense
router.post(
  "/expense",
  sumValidate(),
  titleValidate(),
  textValidate(),
  repeatValidate(),
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
        repeating: repeating,
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
  repeatValidate(),
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
              repeating: repeating,
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

//UPDATE for user to set their username
router.put(
  "/user/:userId",
  usernameValidate(),
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    //Validate content
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: "Invalid content" });
    }
    try {
      const targetUser = await User.findById(req.params.userId);
      if (!targetUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const username = req.body.username;
      const preExist = await User.findOne({ username: username });
      if (preExist) return res.status(403).json({ error: "Username taken!" });
      if (targetUser._id.equals(req.user.id) || req.user.adminStatus === true) {
        targetUser.updateOne({ username: username }).exec();
        return res.status(200).json({
          message: "Username updated! Login again to apply changes.",
        });
      } else {
        return res.status(403).json({ error: "You are not authorized" });
      }
    } catch (error) {
      res.status(500).json({ error: "Updating username failed!" });
    }
  },
);

//UPDATE for user to set their budget
router.put(
  "/budget",
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
      targetUser.updateOne({ budget: budget }).exec();
      return res.status(200).json({
        message: "Budget set!",
      });
    } catch (error) {
      res.status(500).json({ error: "Setting budget failed!" });
    }
  },
);

//GET user budget
router.get(
  "/budget",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const tokenUserId = req.user.id;
      User.findById(tokenUserId).then((targetUser) => {
        if (!targetUser) {
          return res.status(404).json({ error: "User not found" });
        } else {
          res.status(200).json({ budget: targetUser.budget });
        }
      });
    } catch (error) {
      res.status(500).json({ error: "Error" });
    }
  },
);

//DELETE for user
router.delete(
  "/user/:userId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const targetUser = await User.findById(req.params.userId);
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

//GET all users for the super admin to see and manage
router.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const users = await User.find();
      if (!users) {
        return res.status(404).json({ error: "No users" });
      }
      if (!req.user.adminStatus) {
        return res.status(403).json({ error: "Error!" });
      } else if (req.user.adminStatus === true) {
        res.send(users);
      } else {
        return res.status(403).json({ error: "Error!" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error" });
    }
  },
);

//GET username from database. This is to show it after update
router.get(
  "/name/:userId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const targetUser = await User.findById(req.params.userId);
      if (!targetUser) {
        return res.status(404).json({ error: "User not found" });
      } else {
        res.status(200).send(targetUser.username);
      }
    } catch (error) {
      res.status(500).json({ error: "Error" });
    }
  },
);

module.exports = router;
