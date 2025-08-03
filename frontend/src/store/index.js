import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
// import tutorialReducer from './slices/tutorialSlice';
import gameReducer from './slices/gameSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    // tutorial: tutorialReducer,
    game: gameReducer,
  },
});
