import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true
  },
  // ensName: {
  //   type: String,
  //   default: ''
  // },
  tokenBalance: {
    type: Number,
    default: 100 // Starting with 100 tokens
  },
  topics:[String],
  achievements: [{
    id: String,
    name: String,
    unlockedAt: Date
  }],
  trades: {
    completed: { type: Number, default: 0 },
    totalVolume: { type: Number, default: 0 }
  },
  loans: [{
    tokenBorrowed: String,
    amount: Number,
    collateralToken: String,
    collateralAmount: Number,
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('User', userSchema);