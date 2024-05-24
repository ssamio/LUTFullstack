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
const usernameValidate = () =>
  body("username").isString().exists().trim().bail();

//GET all expenses that exist
router.get("/expenses", async (req, res) => {
  const expenses = await Expense.find().populate("user", "username");
  if (expenses) {
    res.send(expenses);
  } else {
    res.status(404).json({ error: "Expenses not found" });
  }
});

//GET a single expense by id
router.get("/expense/:expenseId", async (req, res) => {
  const expense = await Expense.findById(req.params.expenseId).populate(
    "user",
    "username",
  );
  if (expense) {
    res.send(expense);
  } else {
    res.status(404).json({ error: "Expense not found" });
  }
});

//POST for new post
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
      const { title, text, sum } = req.body;
      let ID;
      req.user.then((userData) => {
        ID = userData._id;
        const expense = new Expense({
          title: title,
          text: text,
          sum: sum,
          user: ID,
        });
        expense.save();
        return res.status(200).json({ message: "Expense created!" });
      });
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
      const expense = await Expense.findById(req.params.expenseId);
      if (!expense) {
        return res.status(404).json({ error: "Expense not found" });
      }

      req.user.then((userData) => {
        if (
          userData._id.equals(expense.user) ||
          userData.adminStatus === true
        ) {
          expense.deleteOne();
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
      const expense = await Expense.findById(req.params.expenseId);
      if (!expense) {
        return res.status(404).json({ error: "Expense not found" });
      }

      const { title, text, sum } = req.body;
      req.user.then((userData) => {
        if (
          userData._id.equals(expense.user) ||
          userData.adminStatus === true
        ) {
          expense.updateOne({ title: title, text: text, sum: sum }).exec();
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

      req.user.then((userData) => {
        if (
          userData._id.equals(targetUser._id) ||
          userData.adminStatus === true
        ) {
          targetUser.updateOne({ username: username }).exec();
          return res.status(200).json({
            message: "Username updated! Login again to apply changes.",
          });
        } else {
          return res.status(403).json({ error: "You are not authorized" });
        }
      });
    } catch (error) {
      res.status(500).json({ error: "Updating username failed!" });
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

      req.user.then((userData) => {
        if (
          userData._id.equals(targetUser._id) ||
          userData.adminStatus === true
        ) {
          //Delete user
          targetUser.deleteOne();
          //Find all expenses the user has made
          const userExpenses = Expense.find({ user: targetUser._id });
          //Delete all expenses the user has made
          Expense.deleteMany({ user: targetUser._id }).exec();

          return res.status(200).json({ message: "User deleted. Goodbye! :)" });
        } else {
          return res.status(403).json({ error: "You are not authorized" });
        }
      });
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

      req.user.then((userData) => {
        if (!userData) {
          return res.status(403).json({ error: "Error!" });
        } else if (userData.adminStatus === true) {
          res.send(users);
        } else {
          return res.status(403).json({ error: "Error!" });
        }
      });
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
