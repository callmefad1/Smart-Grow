import { database } from '../config/firebaseConfig';
import { ref, push, set, onValue, update, remove, get } from 'firebase/database';

const SUBSCRIPTIONS_PATH = 'subscriptions';

export const subscribeListener = (callback) => {
  const r = ref(database, SUBSCRIPTIONS_PATH);
  return onValue(r, (snap) => {
    const val = snap.val() || {};
    const list = Object.keys(val).map((k) => ({ id: k, ...val[k] }));
    callback(list);
  });
};

export const getSubscriptionsOnce = async () => {
  const r = ref(database, SUBSCRIPTIONS_PATH);
  const snap = await get(r);
  const val = snap.val() || {};
  return Object.keys(val).map((k) => ({ id: k, ...val[k] }));
};

export const createSubscription = async (subscription) => {
  const r = ref(database, SUBSCRIPTIONS_PATH);
  const newRef = push(r);
  await set(newRef, subscription);
  return { id: newRef.key, ...subscription };
};

export const updateSubscription = async (id, updates) => {
  const r = ref(database, `${SUBSCRIPTIONS_PATH}/${id}`);
  await update(r, updates);
};

export const deleteSubscription = async (id) => {
  const r = ref(database, `${SUBSCRIPTIONS_PATH}/${id}`);
  await remove(r);
};