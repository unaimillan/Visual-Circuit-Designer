// Хранилище output состояний и подписчиков
let allOutputStates = {};
const subscribers = new Map(); // Map<outputId, callback>

export function updateOutputStates(newStates) {
  const changed = {};

  for (const [key, newVal] of Object.entries(newStates)) {
    if (allOutputStates[key] !== newVal) {
      changed[key] = newVal;
    }
  }

  // Обновляем глобальное состояние
  allOutputStates = {
    ...allOutputStates,
    ...newStates
  };

  // Уведомляем подписчиков только об изменениях
  for (const [key, val] of Object.entries(changed)) {
    const callback = subscribers.get(key);
    if (callback) callback(val);
  }
}

export function subscribeToOutput(outputId, callback) {
  subscribers.set(outputId, callback);

  // Возвращаем отписку
  return () => {
    subscribers.delete(outputId);
  };
}
