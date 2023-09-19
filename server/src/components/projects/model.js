const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  total_progress: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  favorite: {type: Boolean, default: false},
  workspace: {type: mongoose.Schema.Types.ObjectId, ref: 'Workspace',required: true}
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
