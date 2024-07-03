const mongoose = require('mongoose');

const mixedProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  projects: [
    {
      project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    },
  ],
  collaborators: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      color: { type: String, default: "pink"},
      favorite: { type: Boolean, default: false },
      permission: {
        type: String,
        enum: ['view', 'edit', 'admin', "owner"], // Puedes agregar más roles si es necesario
        default: 'view',
      },
    },
  ],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const MixedProject = mongoose.model('MixedProject', mixedProjectSchema);

module.exports = MixedProject;
