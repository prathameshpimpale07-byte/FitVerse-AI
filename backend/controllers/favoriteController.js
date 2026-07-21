const Favorite = require('../models/Favorite');

exports.getFavorites = async (req, res, next) => {
  try {
    let favorite = await Favorite.findOne({ userId: req.user._id }).populate('exerciseIds');
    if (!favorite) {
      favorite = await Favorite.create({ userId: req.user._id, exerciseIds: [] });
    }
    res.status(200).json({ success: true, data: favorite.exerciseIds });
  } catch (error) {
    next(error);
  }
};

exports.addFavorite = async (req, res, next) => {
  try {
    const { exerciseId } = req.body;
    let favorite = await Favorite.findOne({ userId: req.user._id });
    
    if (!favorite) {
      favorite = await Favorite.create({ userId: req.user._id, exerciseIds: [exerciseId] });
    } else {
      if (!favorite.exerciseIds.includes(exerciseId)) {
        favorite.exerciseIds.push(exerciseId);
        await favorite.save();
      }
    }
    
    res.status(200).json({ success: true, data: favorite.exerciseIds });
  } catch (error) {
    next(error);
  }
};

exports.removeFavorite = async (req, res, next) => {
  try {
    const { exerciseId } = req.params;
    let favorite = await Favorite.findOne({ userId: req.user._id });
    
    if (favorite) {
      favorite.exerciseIds = favorite.exerciseIds.filter(id => id.toString() !== exerciseId);
      await favorite.save();
    }
    
    res.status(200).json({ success: true, data: favorite ? favorite.exerciseIds : [] });
  } catch (error) {
    next(error);
  }
};
