var User = require('../models/User.js');
var jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'dummy_client_id');

var generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};
    exports.register = async (req, res, next) => {
      try {
        const { name, email, password, role, phone, age, gender, fitnessGoal, height, weight } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ success: false, message: "Email already registered" });
        }
        const user = await User.create({
          name,
          email,
          password,
          role: role || "user",
          phone,
          age,
          gender,
          fitnessGoal,
          height,
          weight
        });
        const token = generateToken(user._id);

        // Send Welcome Notification
        const createNotification = require('../utils/createNotification');
        setTimeout(() => {
          createNotification({
            user: user._id,
            title: '🎉 Welcome to FitVerse AI!',
            description: `Welcome aboard, ${user.name}! Your AI fitness journey begins now.`,
            category: 'System',
            priority: 'High',
            icon: 'FaHandSparkles'
          }).catch(console.error);
        }, 1500);

        res.status(201).json({
          success: true,
          token,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            streak: user.streak
          }
        });
      } catch (error) {
        next(error);
      }
    };
    exports.login = async (req, res, next) => {
      try {
        const { email, password } = req.body;
        if (!email || !password) {
          return res.status(400).json({ success: false, message: "Please provide email and password" });
        }
        const user = await User.findOne({ email }).select("+password");
        if (!user || !await user.matchPassword(password)) {
          return res.status(401).json({ success: false, message: "Invalid email or password" });
        }
        const token = generateToken(user._id);

        // Real-time notification trigger with FitVerse AI title
        const createNotification = require('../utils/createNotification');
        setTimeout(() => {
          createNotification({
            user: user._id,
            title: '👋 Welcome back to FitVerse AI!',
            description: `Great to see you, ${user.name}! Ready to crush your goals today? Let's go!`,
            category: 'System',
            priority: 'Low',
            icon: 'FaHandSparkles'
          }).catch(console.error);
        }, 1500);

        res.json({
          success: true,
          token,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            streak: user.streak,
            fitnessGoal: user.fitnessGoal
          }
        });
      } catch (error) {
        next(error);
      }
    };
    exports.googleLogin = async (req, res, next) => {
      try {
        const { token } = req.body;
        
        if (!token) {
          return res.status(400).json({ success: false, message: 'No Google token provided' });
        }

        // Verify the token with allowed client IDs
        const allowedClientIds = [
          process.env.GOOGLE_CLIENT_ID,
          '65460293350-81bn2cd3kjde7dnqsrtcqpfhcd2k67gk.apps.googleusercontent.com',
          '65460293350-m76sjjtl647l4sk4vm3dq1ibuu4tj6m3.apps.googleusercontent.com'
        ].filter(Boolean);

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: allowedClientIds,
        });
        const payload = ticket.getPayload();
        const { email, name, picture: avatar } = payload;

        let isNewUser = false;
        let user = await User.findOne({ email });
        if (!user) {
          isNewUser = true;
          const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
          user = await User.create({
            name,
            email,
            password: randomPassword,
            avatar,
            role: "user"
          });
        }

        // Send Welcome Notification for Google login / signup
        const createNotification = require('../utils/createNotification');
        setTimeout(() => {
          createNotification({
            user: user._id,
            title: isNewUser ? '🎉 Welcome to FitVerse AI!' : '👋 Welcome back to FitVerse AI!',
            description: isNewUser 
              ? `Welcome aboard, ${user.name}! Your AI fitness journey begins now.`
              : `Great to see you, ${user.name}! Ready to crush your goals today?`,
            category: 'System',
            priority: isNewUser ? 'High' : 'Low',
            icon: 'FaHandSparkles'
          }).catch(console.error);
        }, 1500);

        const jwtToken = generateToken(user._id);
        res.json({
          success: true,
          token: jwtToken,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            streak: user.streak,
            fitnessGoal: user.fitnessGoal
          }
        });
      } catch (error) {
        next(error);
      }
    };
    exports.getProfile = async (req, res, next) => {
      try {
        const user = await User.findById(req.user._id).populate("membership");
        res.json({ success: true, user });
      } catch (error) {
        next(error);
      }
    };

    exports.forgotPassword = async (req, res, next) => {
      try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
          return res.status(404).json({ success: false, message: 'There is no user with that email' });
        }

        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

        let transporter;
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
          transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          });
        } else {
          const testAccount = await nodemailer.createTestAccount();
          transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, 
            auth: {
              user: testAccount.user,
              pass: testAccount.pass,
            },
          });
        }

        const mailOptions = {
          from: `"FitVerse AI" <${process.env.EMAIL_USER || 'noreply@fitverse.com'}>`,
          to: user.email,
          subject: 'Password Reset Request - FitVerse AI',
          html: `
            <h3>You requested a password reset</h3>
            <p>Please go to this link to reset your password:</p>
            <a href="${resetUrl}" target="_blank">${resetUrl}</a>
            <p>If you did not request this, please ignore this email.</p>
          `
        };

        try {
          const info = await transporter.sendMail(mailOptions);
          if (!process.env.EMAIL_USER) {
            console.log("Password Reset Preview URL: %s", nodemailer.getTestMessageUrl(info));
          }
          res.status(200).json({ success: true, message: 'Email sent' });
        } catch (err) {
          user.resetPasswordToken = undefined;
          user.resetPasswordExpire = undefined;
          await user.save({ validateBeforeSave: false });
          return res.status(500).json({ success: false, message: 'Email could not be sent' });
        }
      } catch (error) {
        next(error);
      }
    };

    exports.resetPassword = async (req, res, next) => {
      try {
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

        const user = await User.findOne({
          resetPasswordToken,
          resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
          return res.status(400).json({ success: false, message: 'Invalid or expired token' });
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        const token = generateToken(user._id);
        res.status(200).json({ success: true, token });
      } catch (error) {
        next(error);
      }
    };

    exports.changePassword = async (req, res, next) => {
      try {
        const { email, oldPassword, newPassword } = req.body;
        if (!email || !oldPassword || !newPassword) {
          return res.status(400).json({ success: false, message: "Please provide email, old password, and new password" });
        }
        const user = await User.findOne({ email }).select("+password");
        if (!user || !(await user.matchPassword(oldPassword))) {
          return res.status(401).json({ success: false, message: "Invalid email or old password" });
        }
        
        // basic regex check
        const isValid = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(newPassword);
        if (!isValid) {
          return res.status(400).json({ success: false, message: "Password must have 8+ chars, 1 uppercase, 1 number & 1 special char" });
        }

        user.password = newPassword;
        await user.save();
        res.status(200).json({ success: true, message: "Password updated successfully" });
      } catch (error) {
        next(error);
      }
    };
