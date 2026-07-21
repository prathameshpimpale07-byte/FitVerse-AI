const PersonalRecord = require('../models/PersonalRecord');

exports.getPersonalRecords = async (req, res) => {
  try {
    const userId = req.user._id;
    const records = await PersonalRecord.find({ userId }).sort({ exerciseName: 1 });
    res.json({ success: true, count: records.length, records });
  } catch (error) {
    console.error("Get Personal Records Error:", error);
    res.status(500).json({ success: false, message: "Server error fetching personal records." });
  }
};

exports.deletePersonalRecord = async (req, res) => {
  try {
    const record = await PersonalRecord.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!record) {
      return res.status(404).json({ success: false, message: "Personal record not found." });
    }
    res.json({ success: true, message: "Personal record deleted successfully." });
  } catch (error) {
    console.error("Delete Personal Record Error:", error);
    res.status(500).json({ success: false, message: "Server error deleting personal record." });
  }
};

exports.addOrUpdateRecord = async (req, res) => {
  try {
    const { exerciseName, value, unit } = req.body;
    if (!exerciseName || value === undefined || !unit) {
      return res.status(400).json({ success: false, message: "Exercise name, value and unit are required." });
    }

    const userId = req.user._id;

    // Check if user has an existing record for this exercise
    let record = await PersonalRecord.findOne({ userId, exerciseName });

    if (record) {
      // Update record if the new value is a new Personal Record
      // For runs/times: lesser could be better, but let's assume higher value is better (e.g. heavier weight or longer plank)
      // If user wants to log their absolute current best, we can just replace it or save the max.
      // Let's do simple override or take the maximum value.
      if (exerciseName.toLowerCase().includes("run") || exerciseName.toLowerCase().includes("time")) {
        // Assume lesser is better for running times, otherwise higher is better
        if (value < record.value) {
          record.value = value;
          record.achievedAt = new Date();
          await record.save();
        }
      } else {
        if (value > record.value) {
          record.value = value;
          record.achievedAt = new Date();
          await record.save();
        }
      }
    } else {
      record = await PersonalRecord.create({
        userId,
        exerciseName,
        value,
        unit
      });
    }

    res.status(200).json({ success: true, message: "Personal Record logged!", record });
  } catch (error) {
    console.error("Add Personal Record Error:", error);
    res.status(500).json({ success: false, message: "Server error saving personal record." });
  }
};
