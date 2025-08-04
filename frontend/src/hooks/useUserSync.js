import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { checkAndRegisterUser } from '../store/slices/userSlice';

export const useUserSync = () => {
  const dispatch = useAppDispatch();
  const { wallet, user, loading } = useAppSelector(state => state.user);
  const [lastSync, setLastSync] = useState(null);

  console.log('useUserSync - wallet:', wallet);
  console.log('useUserSync - user:', user);
  console.log('useUserSync - loading:', loading);

  // Sync user data from MongoDB
  const syncUserData = async () => {
    if (!wallet) return;

    try {
      await dispatch(checkAndRegisterUser(wallet)).unwrap();
      setLastSync(new Date());
    } catch (error) {
      console.error('Error syncing user data:', error);
    }
  };

  // Sync user data when wallet changes
  useEffect(() => {
    if (wallet) {
      syncUserData();
    }
  }, [wallet]);

  // Auto-sync every 30 seconds if user is active
  useEffect(() => {
    if (!wallet) return;

    const interval = setInterval(() => {
      syncUserData();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [wallet]);

  return {
    syncUserData,
    lastSync,
    loading,
    user
  };
}; 