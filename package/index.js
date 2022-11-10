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
  store.on('append', function(data) {
    store.update(function($data) {
      return ($data || []).concat(data.value)
    })
  })
  store.on('update_by', function(data) {
    store.update(function($data) {
      return ($data || []).map(function(item) {
        if (item[data.key] == data.value) {
          return Object.assign(item, data.changes)
        } else {
          return item
        }
      })
    })
  })
  store.on('delete_by', function(data) {
    store.update(function($data) {
      return ($data || []).filter(function(item) {
        return item[data.key] != data.value
      })
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
  if (!sgid) {
    const store = getStore(store_id, null)
    store.set(null)
    return store
  }
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