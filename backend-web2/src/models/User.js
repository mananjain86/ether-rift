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
  tokenBalances: {
    vETH: { type: Number, default: 100 },
    vUSDC: { type: Number, default: 0 },
    vDAI: { type: Number, default: 0 },
    ERA: { type: Number, default: 0 }
  },
  topics:[String],
  achievements: [{
    id: String,
    name: String,
    unlockedAt: Date
  }],
  trades: {
    completed: { type: Number, default: 0 },
    totalVolume: { type: Number, default: 0 },
    history: [{ type: Object, default: [] }]
  },
  loans: [{
    tokenBorrowed: String,
    amount: Number,
    collateralToken: String,
    collateralAmount: Number,
    timestamp: { type: Date, default: Date.now }
  }],
  winLoss: {
    type: [Number],
    default: [0, 0] // [wins, losses]
  },
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