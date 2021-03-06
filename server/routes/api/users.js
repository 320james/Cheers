const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../../middleware/auth");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
var mysqlPool = require("../../mysqlPool");

// @route   POST api/users
// @desc    Register user
// @access  Public (aka you don't need a token to access this route)

router.post(
  "/",
  [
    check("user_name", "username is required").not().isEmpty(),
    check("first_name", "first_name is required").not().isEmpty(),
    check("last_name", "last_name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({
      min: 6,
    }),
    check("is_admin", "is_admin is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // If there is an error from express validator, return error code
    }

    let {
      user_name,
      first_name,
      last_name,
      email,
      password,
      is_admin,
    } = req.body;

    try {
      // See if user exists
      mysqlPool.getConnection(function (err, mclient) {
        let sql = `SELECT * FROM users WHERE email="${email}" OR user_name="${user_name}"`;
        mclient.query(sql, async (err, resp) => {
          if (err) {
            throw err;
          }
          if (resp.length > 0) {
            mclient.release();
            return res
              .status(400)
              .json({ errors: [{ msg: "User already exists" }] });
          }

          // Encrypt password
          const salt = await bcrypt.genSalt(10);

          password = await bcrypt.hash(password, salt); // Creates a hash for the user's password

          // await user.save();  // Anything that uses a Promise, put await before it

          let newUser = {
            user_name,
            first_name,
            last_name,
            email,
            password,
            is_admin,
          };
          let sql = `INSERT INTO users SET ?`;
          mclient.query(sql, newUser, (err, resp) => {
            if (err) {
              throw err;
            }
            mclient.release();
          });

          // Jsonwebtoken stuff
          const payload = {
            user: {
              id: user_name,
            },
          };
          // Sign the token
          jwt.sign(
            payload,
            config.get("jwtSecret"),
            { expiresIn: 360000 },
            (err, token) => {
              if (err) throw err;
              res.json({ token });
            }
          );
        });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   PUT api/users
// @desc    Change user password
// @access  Private
router.put(
  "/",
  [
    auth,
    [
      check(
        "password",
        "Please enter a password with 6 or more characters"
      ).isLength({
        min: 6,
      }),
    ],
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // If there is an error from express validator, return error code
      }
      // Get user from auth middleware which returned the user's user_name
      mysqlPool.getConnection(function (err, mclient) {
        let sql = `SELECT * FROM users WHERE user_name="${req.user.id}"`;
        mclient.query(sql, async (err, resp) => {
          if (err) {
            throw err;
          }
          if (resp.length === 0) {
            return res
              .status(400)
              .json({ errors: [{ msg: "User doesn't exist" }] });
          }
          // Encrypt password
          let { password } = req.body;
          const salt = await bcrypt.genSalt(10);
          password = await bcrypt.hash(password, salt); // Creates a hash for the user's password

          sql = `UPDATE users SET password = "${password}" WHERE user_name = "${req.user.id}"`;
          mclient.query(sql, async (err, resp) => {
            if (err) {
              throw err;
            }
            mclient.release();
            return res.json(resp);
          });
        });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   PUT api/users/name
// @desc    Change user password
// @access  Private
router.put(
  "/name",
  [
    auth,
    [
      check("first_name", "first_name is required").not().isEmpty(),
      check("last_name", "last_name is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // If there is an error from express validator, return error code
      }
      // Get user from auth middleware which returned the user's user_name
      mysqlPool.getConnection(function (err, mclient) {
        let sql = `SELECT * FROM users WHERE user_name="${req.user.id}"`;
        mclient.query(sql, async (err, resp) => {
          if (err) {
            throw err;
          }
          if (resp.length === 0) {
            return res
              .status(400)
              .json({ errors: [{ msg: "User doesn't exist" }] });
          }
          let { first_name, last_name } = req.body;

          sql = `UPDATE users SET first_name = "${first_name}", last_name = "${last_name}" WHERE user_name = "${req.user.id}"`;
          mclient.query(sql, async (err, resp) => {
            if (err) {
              throw err;
            }
            mclient.release();
            return res.json(resp);
          });
        });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   PUT api/users/:id
// @desc    Change user with id to be an admin
// @access  Private
router.put("/:id", auth, async (req, res) => {
  try {
    // Get user from auth middleware which returned the user's user_name and make sure they are admin
    mysqlPool.getConnection(function (err, mclient) {
      let sql = `SELECT * FROM users WHERE user_name="${req.user.id}"`;
      mclient.query(sql, async (err, resp) => {
        if (err) {
          throw err;
        }
        if (resp.length === 0) {
          mclient.release();
          return res
            .status(400)
            .json({ errors: [{ msg: "User doesn't exist" }] });
        }
        if (resp[0].is_admin == 0) {
          mclient.release();
          return res
            .status(400)
            .json({ errors: [{ msg: "User is not an admin" }] });
        }
        sql = `UPDATE users SET is_admin = 1 WHERE user_name = "${req.params.id}"`;
        mclient.query(sql, async (err, resp) => {
          if (err) {
            throw err;
          }
          mclient.release();
          return res.json(resp);
        });
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/users
// @desc    Get all users
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    //   const posts = await Post.find().sort({ date: -1 }); // -1 is sort by most recent
    mysqlPool.getConnection(function (err, mclient) {
      let sql = `SELECT users.user_name, users.email, users.first_name, users.last_name, users.is_admin
      FROM users`;
      mclient.query(sql, async (err, resp) => {
        if (err) {
          throw err;
        }
        mclient.release();
        res.json(resp);
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/users/:id
// @desc    Delete user with id
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    // Get user from auth middleware which returned the user's user_name and make sure they are admin
    mysqlPool.getConnection(function (err, mclient) {
      let sql = `SELECT * FROM users WHERE user_name="${req.user.id}"`;
      mclient.query(sql, async (err, resp) => {
        if (err) {
          throw err;
        }
        if (resp.length === 0) {
          mclient.release();
          return res
            .status(400)
            .json({ errors: [{ msg: "User doesn't exist" }] });
        }
        if (resp[0].is_admin == 0) {
          mclient.release();
          return res
            .status(400)
            .json({ errors: [{ msg: "User is not an admin" }] });
        }

        // Delete user with req.params.id
        sql = `DELETE FROM users WHERE user_name = "${req.params.id}"`;
        mclient.query(sql, async (err, resp) => {
          if (err) {
            throw err;
          }
          mclient.release();
          return res.json(resp);
        });
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
