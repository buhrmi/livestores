import { createConsumer } from "@rails/actioncable";
import { writable } from "svelte/store";
import deepmerge from 'deepmerge'
let consumer;
let stores = {}

export function upsert(key) {
  return function(target, source) {
    source.forEach(function(updatedItem) {
      const oldItem = target.find((item) => item[key] == updatedItem[key])
      if (oldItem) Object.assign(oldItem, updatedItem)
      else target.push(updatedItem)
    })
    return target
  }
}

function storeWithHandlers(initial = null) {
  const store = writable(initial);
  const callbacks = {};
  store.on = function(event, callback) {
    callbacks[event] = callback;
    return store;
  };
  store.handle = function(event, data) {
    if (callbacks[event]) {
      callbacks[event](data);
    }
    return store;
  };
  store.on("set", function(data) {
    store.set(data.value);
  });
  store.on("merge", function(data) {
    store.update(function($data) {
      return deepmerge($data, data.value);
    });
  });
  store.on("upsert", function(data) {
    const arrayMerge = upsert(data.key)
    store.update(function($data) {
      return deepmerge($data, data.value, {arrayMerge});
    })
  })
  
  return store;
}

export function getStore(storeId, mergeData, arrayMerge) {
  const store = stores[storeId]

  if (store && mergeData !== undefined) store.update(function($data) {
    return $data ? deepmerge($data, mergeData, { arrayMerge }) : mergeData
  })
 
  return (stores[storeId] ||= storeWithHandlers(mergeData));
}

export function initStore(storeId, initialData) {
  const store = stores[storeId] ||= storeWithHandlers()
  store.set(initialData)
  return store
}

export function perform(storeId, action, ...args) {
  return getStore(storeId).perform(action, ...args);
}

export function unsubscribe(subscription) {
  if (!consumer) return;
  consumer.subscriptions.remove(subscription);
}

export function subscribe(channel, params = {}) {
  if (typeof document == "undefined") return () => {};

  if (!consumer) consumer = createConsumer();

  const subscription = consumer.subscriptions.create(
    { channel, ...params },
    {
      received: function (data) {
        getStore(data.store_id).handle(data.action, data);
      },
    },
  );

  return function unsubscribe() {
    consumer.subscriptions.remove(subscription);
  };
}