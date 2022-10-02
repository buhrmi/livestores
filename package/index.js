import { createConsumer } from "@rails/actioncable"
import { writable } from 'svelte/store'

const consumer = createConsumer()

const stores = {}
const subscriptions = {}

function writableWithEvents(initialData) {
  const store = writable(initialData)
  const callbacks = {}
  store.on = function(event, callback) {
    callbacks[event] = callback
    return store
  }
  store.handle = function(event, data) {
    if (callbacks[event]) {
      callbacks[event](data)
    }
    return store
  }
  store.on('update', function(data) {
    store.update(function($data) {
      return Object.assign($data || {}, data.changes)
    })
  })
  return store
}

function getStore(storeId, initialData) {
  return stores[storeId] ||= writableWithEvents(initialData)
}

export function subscribe(sgid, initial, store_id = sgid) {
  if (sgid !== store_id && subscriptions[store_id]) {
    consumer.subscriptions.remove(subscriptions[store_id])
    subscriptions[store_id] = null
  }
  if (!sgid) return writable(null)
  const defaultStore = getStore(store_id, initial)
  const subscription = subscriptions[store_id] ||= consumer.subscriptions.create({ channel: "Actionstore::Channel", sgid }, {
    received: function(data) {
      getStore(data.store_id || store_id).handle(data.action, data)
    }
  })
  defaultStore.perform = function(action, ...args) {
    return subscription.perform(action, {args})
  }
  defaultStore.unsubscribe = function() {
    subscriptions[sgid] = null
    consumer.subscriptions.remove(subscription)
  }
  return defaultStore
}

export {getStore as store}