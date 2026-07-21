var User = require('../models/User.js');
    var Trainer = require('../models/Trainer.js');
    var Workout = require('../models/Workout.js');
    var Diet = require('../models/Diet.js');
    var Membership = require('../models/Membership.js');
    var Booking = require('../models/Booking.js');
    var Contact = require('../models/Contact.js');
    var Blog = require('../models/Blog.js');
    exports.getAnalytics = async (req, res, next) => {
      try {
        const [totalUsers, totalTrainers, totalWorkouts, totalDiets, totalBookings, totalContacts] = await Promise.all([
          User.countDocuments({ role: "user" }),
          Trainer.countDocuments(),
          Workout.countDocuments(),
          Diet.countDocuments(),
          Booking.countDocuments(),
          Contact.countDocuments({ status: "new" })
        ]);
        const recentUsers = await User.find({ role: "user" }).sort({ createdAt: -1 }).limit(5).select("name email createdAt");
        const recentBookings = await Booking.find().sort({ createdAt: -1 }).limit(5).populate("user", "name").populate("trainer", "name");
        res.json({
          success: true,
          analytics: {
            totalUsers,
            totalTrainers,
            totalWorkouts,
            totalDiets,
            totalBookings,
            pendingContacts: totalContacts,
            recentUsers,
            recentBookings
          }
        });
      } catch (error) {
        next(error);
      }
    };
    exports.getContacts = async (req, res, next) => {
      try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json({ success: true, contacts });
      } catch (error) {
        next(error);
      }
    };
    exports.submitContact = async (req, res, next) => {
      try {
        const contact = await Contact.create(req.body);
        res.status(201).json({ success: true, message: "Message sent successfully", contact });
      } catch (error) {
        next(error);
      }
    };
    exports.updateContact = async (req, res, next) => {
      try {
        const contact = await Contact.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        res.json({ success: true, contact });
      } catch (error) {
        next(error);
      }
    };
    exports.getBlogs = async (req, res, next) => {
      try {
        const blogs = await Blog.find().populate("author", "name").sort({ createdAt: -1 });
        res.json({ success: true, blogs });
      } catch (error) {
        next(error);
      }
    };
    exports.createBlog = async (req, res, next) => {
      try {
        const blog = await Blog.create({ ...req.body, author: req.user._id });
        res.status(201).json({ success: true, blog });
      } catch (error) {
        next(error);
      }
    };
    exports.updateBlog = async (req, res, next) => {
      try {
        const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, blog });
      } catch (error) {
        next(error);
      }
    };
    exports.deleteBlog = async (req, res, next) => {
      try {
        await Blog.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Blog deleted" });
      } catch (error) {
        next(error);
      }
    };
