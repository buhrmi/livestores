import { createConsumer } from "@rails/actioncable";
import { writable } from "svelte/store";
import deepmerge from 'deepmerge'
let consumer;
let stores = {}

function upsert(key) {
  return function(target, source) {
    source.forEach(function(updatedItem) {
      const oldItem = target.find((item) => item[key] == updatedItem[key])
      if (oldItem) Object.assign(oldItem, updatedItem)
      else target.push(updatedItem)
    })
    return target
  }
}

const handlers = {
  set(store, data) {
    store.set(data.value);
  },
  merge(store, data, arrayMerge) {
    store.update(function($data) {
      return deepmerge($data, data.value, {arrayMerge});
    });
  },
  upsert(store, data) {
    const arrayMergeFn = upsert(data.key)
    handlers.merge(store, data, arrayMergeFn)
  },
};

export function reset() {
  stores = {};
}

export function registerHandler(action, handler) {
  if (typeof action !== "string") {
    throw new Error("Action must be a string");
  }
  if (typeof handler !== "function") {
    throw new Error("Handler must be a function");
  }
  handlers[action] = handler;
}

function handle(store, action, data) {
  if (typeof action !== "string") {
    throw new Error("Action must be a string");
  }
  if (typeof handlers[action] !== "function") {
    throw new Error(`No handler registered for action: ${action}`);
  }
  handlers[action](store, data);
}

export function getStore(storeId, mergeData, arrayMerge) {
  const store = stores[storeId]

  if (store && mergeData !== undefined) store.update(function($data) {
    return $data ? deepmerge($data, mergeData, { arrayMerge }) : mergeData
  })
 
  return (stores[storeId] ||= writable(mergeData));
}

export function initStore(storeId, initialData) {
  const store = stores[storeId] ||= writable()
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
        const store = getStore(data.store_id)
        handle(store, data.action, data);
      },
    },
  );

  return function unsubscribe() {
    consumer.subscriptions.remove(subscription);
  };
}