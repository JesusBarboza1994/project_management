import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  relative_weight: { type: Number, required: true },
  relative_weight_percentage: { type: Number, required: true },
  absolute_weight: { type: Number, required: true },
  relative_progress: { type: Number, default: 0 },
  order: [{ type: Number, default: 1 }],
  absolute_progress: { type: Number, default: 0 },
  init_date: { type: Date, default: Date.now },
  end_date: { type: Date, default: Date.now },
  index: { type: Number, required: true },
  has_subactivities: { type: Boolean, default: false},
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ActivityOrProject', // Hace referencia a un modelo genérico 'ActivityOrProject'
    required: true
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Activity = mongoose.model('Activity', activitySchema);

export default Activity
