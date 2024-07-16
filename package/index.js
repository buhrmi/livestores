import { createConsumer } from "@rails/actioncable"
import { writable } from 'svelte/store'

let consumer

const stores = {}
const subscriptions = {}

function writableWithEvents(initial = null) {
  const store = writable(initial)
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
  store.on('set', function(data) {
    store.set(data.value)
  })
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
  store.on('append_to', function(data) {
    store.update(function($data) {
      $data[data.key] ||= []
      $data[data.key] = $data[data.key].concat(data.value)
      return $data
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
  store.on('update_by_id_in', function(data) {
    store.update(function($data) {
      $data[data.key] ||= []
      for (let i = 0; i < $data[data.key].length; i++) {
        if ($data[data.key][i].id == data.id) {
          $data[data.key][i] = Object.assign($data[data.key][i], data.changes)
          return $data
        }
      }
      return $data
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

export function getStore(storeId, initial = null) {
  return stores[storeId] ||= writableWithEvents(initial)
}
export function setStore(storeId, data) {
  getStore(storeId).set(data)
}


export function unsubscribe(channel) {
  delete subscriptions[channel]
  if (!consumer) return
  consumer.subscriptions.remove(channel)
}

export function subscribe(channel, params = {}) {
  if (typeof document == 'undefined') return () => {}
  
  if (!consumer) consumer = createConsumer()

  // if the params for the channel have changed, remove the old subscription
  if (subscriptions[channel] && subscriptions[channel].params !== JSON.stringify(params)) {
    const subscription = subscriptions[channel]
    delete subscriptions[channel]
    consumer.subscriptions.remove(subscription)
  }

  const subscription = subscriptions[channel] ||= consumer.subscriptions.create({ channel, ...params }, {
    received: function(data) {
      getStore(data.store_id).handle(data.action, data)
    }
  })

  subscription.params = JSON.stringify(params)

  return {
    unsubscribe() {
      delete subscriptions[channel]
      consumer.subscriptions.remove(subscription)
    },
    perform(action, data) {
      subscription.perform(action, data)
    }
  }
}