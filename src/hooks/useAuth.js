import { useEffect, useState } from 'react';
import AsyncStorage from '../storage/storage';

const KEY = 'ius_lost_found_user';

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((v) => v && setUser(JSON.parse(v)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const login = async (name, studentId) => {
    const u = { id: studentId, name, guest: false };
    setUser(u);
    await AsyncStorage.setItem(KEY, JSON.stringify(u)).catch(() => {});
  };

  const loginAsGuest = () => setUser({ id: 'guest', name: 'Guest', guest: true });

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem(KEY).catch(() => {});
  };

  return { user, loading, login, loginAsGuest, logout };
}
