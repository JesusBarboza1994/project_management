const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  description: { type: String, required: true },
  relative_weight: { type: Number, required: true },
  absolute_weight: { type: Number, required: true },
  relative_progress: { type: Number, default: 0 },
  absolute_progress: { type: Number, default: 0 },
  index: { type: Number, required: true },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity', // Hace referencia al modelo 'Activity'
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project', // Hace referencia al modelo 'Project'
  },
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
