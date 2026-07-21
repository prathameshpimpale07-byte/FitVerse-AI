var Trainer = require('../models/Trainer.js');
var Booking = require('../models/Booking.js');
var createNotification = require('../utils/createNotification.js');
    exports.getTrainers = async (req, res, next) => {
      try {
        const { specialization, search } = req.query;
        let query = { isActive: true };
        if (specialization) query.specialization = { $in: [specialization] };
        if (search) query.name = { $regex: search, $options: "i" };
        const trainers = await Trainer.find(query).sort({ rating: -1 });
        res.json({ success: true, count: trainers.length, trainers });
      } catch (error) {
        next(error);
      }
    };
    exports.getTrainer = async (req, res, next) => {
      try {
        const trainer = await Trainer.findById(req.params.id);
        if (!trainer) return res.status(404).json({ success: false, message: "Trainer not found" });
        res.json({ success: true, trainer });
      } catch (error) {
        next(error);
      }
    };
    exports.createTrainer = async (req, res, next) => {
      try {
        const trainer = await Trainer.create(req.body);
        res.status(201).json({ success: true, trainer });
      } catch (error) {
        next(error);
      }
    };
    exports.updateTrainer = async (req, res, next) => {
      try {
        const trainer = await Trainer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, trainer });
      } catch (error) {
        next(error);
      }
    };
    exports.deleteTrainer = async (req, res, next) => {
      try {
        await Trainer.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Trainer deleted" });
      } catch (error) {
        next(error);
      }
    };
    exports.createBooking = async (req, res, next) => {
      try {
        const { trainer, date, slot, sessionType, notes } = req.body;
        const trainerDoc = await Trainer.findById(trainer);
        if (!trainerDoc) return res.status(404).json({ success: false, message: "Trainer not found" });
        const booking = await Booking.create({
          user: req.user._id,
          trainer,
          date,
          slot,
          sessionType,
          notes,
          amount: trainerDoc.pricePerSession
        });

        // 🔔 Real-time notification
        const sessionLabel = sessionType === 'online' ? 'Online Video' : 'Offline Gym';
        const formattedDate = new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
        await createNotification({
          userId: req.user._id,
          title: `👨‍🏫 Booking Confirmed!`,
          description: `Your ${sessionLabel} session with ${trainerDoc.name} on ${formattedDate} at ${slot} is confirmed.`,
          category: 'Trainer',
          priority: 'High',
          actionUrl: '/dashboard/trainers/bookings',
          actionText: 'View Booking',
        });

        res.status(201).json({ success: true, booking });
      } catch (error) {
        next(error);
      }
    };
    exports.getMyBookings = async (req, res, next) => {
      try {
        const bookings = await Booking.find({ user: req.user._id }).populate("trainer", "name avatar specialization pricePerSession").sort({ createdAt: -1 });
        res.json({ success: true, bookings });
      } catch (error) {
        next(error);
      }
    };
    exports.updateBooking = async (req, res, next) => {
      try {
        const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, booking });
      } catch (error) {
        next(error);
      }
    };
    exports.deleteBooking = async (req, res, next) => {
      try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
        
        // ensure user owns the booking
        if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
           return res.status(401).json({ success: false, message: 'Not authorized' });
        }
        
        await Booking.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Booking deleted" });
      } catch (error) {
        next(error);
      }
    };
