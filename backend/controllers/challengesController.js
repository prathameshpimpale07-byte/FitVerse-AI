const Challenge = require('../models/Challenge');
const createNotification = require('../utils/createNotification');

// Seed some initial challenges if none exist
const seedChallenges = async () => {
  const count = await Challenge.countDocuments();
  if (count === 0) {
    await Challenge.create([
      {
        title: "30-Day Ultimate Fitness",
        description: "Transform your body in 30 days! Complete at least 5 workouts every week.",
        category: "30day",
        durationDays: 30,
        rewards: { xp: 500, coins: 250 },
        target: "Complete 20 workouts in 30 days",
        participantsCount: 1420
      },
      {
        title: "Daily Push-up Challenge",
        description: "Build upper body strength. Log push-ups or chest workouts every single day.",
        category: "pushup",
        durationDays: 7,
        rewards: { xp: 150, coins: 75 },
        target: "Log 100 pushups daily for 7 days",
        participantsCount: 845
      },
      {
        title: "Leg Destroyer Challenge",
        description: "Quad, hamstring, and calf work to build explosive leg power.",
        category: "leg",
        durationDays: 14,
        rewards: { xp: 250, coins: 120 },
        target: "Complete 4 leg-focused routines in 14 days",
        participantsCount: 512
      },
      {
        title: "Cardio Shred Challenge",
        description: "Burn calories and build endurance with running and high-intensity interval training.",
        category: "cardio",
        durationDays: 21,
        rewards: { xp: 350, coins: 180 },
        target: "Run 15 miles total over 21 days",
        participantsCount: 923
      }
    ]);
  }
};

exports.getChallenges = async (req, res) => {
  try {
    await seedChallenges();
    const challenges = await Challenge.find();
    res.json({ success: true, count: challenges.length, challenges });
  } catch (error) {
    console.error("Get Challenges Error:", error);
    res.status(500).json({ success: false, message: "Server error fetching challenges." });
  }
};

exports.joinChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ success: false, message: "Challenge not found" });
    }
    challenge.participantsCount += 1;
    await challenge.save();

    if (req.user) {
      createNotification({
        userId: req.user._id,
        userEmail: req.user.email,
        userName: req.user.name,
        title: '🔥 Challenge Joined!',
        description: `You joined "${challenge.title}". Target: ${challenge.target}. Reward: +${challenge.rewards?.xp || 0} XP & +${challenge.rewards?.coins || 0} Coins. Good luck!`,
        category: 'Challenge',
        priority: 'High',
        icon: 'FaTrophy',
        actionUrl: '/dashboard/challenges',
        actionText: 'View Challenge'
      }).catch(console.error);
    }

    res.json({ success: true, message: "Joined challenge successfully!", challenge });
  } catch (error) {
    console.error("Join Challenge Error:", error);
    res.status(500).json({ success: false, message: "Server error joining challenge." });
  }
};

