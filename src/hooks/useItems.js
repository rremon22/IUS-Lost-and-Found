import { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '../storage/storage';

const KEY = 'ius_lost_found_items';

export default function useItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((v) => v && setItems(JSON.parse(v)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading) AsyncStorage.setItem(KEY, JSON.stringify(items)).catch(() => {});
  }, [items, loading]);

  const addItem = useCallback(
    (data) =>
      setItems((prev) => [
        { id: Date.now().toString(), resolved: false, createdAt: Date.now(), ...data },
        ...prev,
      ]),
    []
  );

  const toggleResolved = useCallback(
    (id) => setItems((prev) => prev.map((i) => (i.id === id ? { ...i, resolved: !i.resolved } : i))),
    []
  );

  const removeItem = useCallback(
    (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
    []
  );

  return { items, loading, addItem, toggleResolved, removeItem };
}
