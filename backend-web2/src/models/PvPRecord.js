import mongoose from 'mongoose';

const pvpRecordSchema = new mongoose.Schema({
  player1: {
    walletAddress: {
      type: String,
      required: true,
      lowercase: true,
      index: true
    },
    score: Number,
    tokensWagered: Number
  },
  player2: {
    walletAddress: {
      type: String,
      required: true,
      lowercase: true,
      index: true
    },
    score: Number,
    tokensWagered: Number
  },
  winner: {
    type: String,
    enum: ['player1', 'player2', 'draw'],
    required: true
  },
  tokensRewarded: Number,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('PvPRecord', pvpRecordSchema);