const mongoose = require('mongoose')

const workspaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  is_deleted: { type: Boolean, default: false },
  user:{type: mongoose.Schema.Types.ObjectId, ref: 'User',required: true}
})

const Workspace = mongoose.model('Workspace', workspaceSchema)

module.exports = Workspace