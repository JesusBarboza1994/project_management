const mongoose = require('mongoose')

const workspaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
})

const Workspace = mongoose.model('Workspace', workspaceSchema)

module.exports = Workspace