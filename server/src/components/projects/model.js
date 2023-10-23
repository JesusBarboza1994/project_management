const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  total_progress: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  color: { type: String, default: "pink"},
  favorite: {type: Boolean, default: false},
  user:{type: mongoose.Schema.Types.ObjectId, ref: 'User',required: true},
  workspace: {type: mongoose.Schema.Types.ObjectId, ref: 'Workspace',required: true},
  collaborators: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      favorite: { type: Boolean, default: false },
      permission: {
        type: String,
        enum: ['view', 'edit', 'admin'], // Puedes agregar más roles si es necesario
        default: 'view',
      },
    },
  ]
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
