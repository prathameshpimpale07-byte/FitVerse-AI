var Membership = require('../models/Membership.js');
var User = require('../models/User.js');
var createNotification = require('../utils/createNotification.js');

exports.getMemberships = async (req, res, next) => {
  try {
    const memberships = await Membership.find({ isActive: true });
    res.json({ success: true, memberships });
  } catch (error) {
    next(error);
  }
};
exports.getMembership = async (req, res, next) => {
  try {
    const membership = await Membership.findById(req.params.id);
    if (!membership) return res.status(404).json({ success: false, message: "Membership not found" });
    res.json({ success: true, membership });
  } catch (error) {
    next(error);
  }
};
exports.createMembership = async (req, res, next) => {
  try {
    const membership = await Membership.create(req.body);
    res.status(201).json({ success: true, membership });
  } catch (error) {
    next(error);
  }
};
exports.updateMembership = async (req, res, next) => {
  try {
    const membership = await Membership.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, membership });
  } catch (error) {
    next(error);
  }
};
exports.deleteMembership = async (req, res, next) => {
  try {
    await Membership.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Membership deleted" });
  } catch (error) {
    next(error);
  }
};
exports.purchaseMembership = async (req, res, next) => {
  try {
    const membership = await Membership.findById(req.params.id);
    if (!membership) return res.status(404).json({ success: false, message: "Membership not found" });
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + (membership.duration || 30));
    await User.findByIdAndUpdate(req.user._id, {
      membership: membership._id,
      membershipExpiry: expiryDate
    });

    const formattedDate = expiryDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    createNotification({
      userId: req.user._id,
      userEmail: req.user.email,
      userName: req.user.name,
      title: '💎 Membership Activated!',
      description: `Your ${membership.name} membership plan is now active until ${formattedDate}. Enjoy full access to FitVerse AI premium features!`,
      category: 'Payment',
      priority: 'High',
      icon: 'FaCrown',
      actionUrl: '/dashboard/membership',
      actionText: 'View Membership'
    }).catch(console.error);

    res.json({ success: true, message: "Membership activated successfully", expiryDate });
  } catch (error) {
    next(error);
  }
};
