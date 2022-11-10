# ActionStore

[![CircleCI](https://circleci.com/gh/buhrmi/actionstore.svg?style=shield)](https://circleci.com/gh/buhrmi/actionstore)
[![Gem Version](https://badge.fury.io/rb/actionstore.svg)](https://rubygems.org/gems/actionstore)
[![npm version](https://badge.fury.io/js/@buhrmi%2Factionstore.svg)](https://www.npmjs.com/package/@buhrmi/actionstore)

ActionStore allows you to push data directly into Svelte stores via ActionCable. Here's an [introductory blog post](https://dev.to/buhrmi/actionstore-real-time-svelte-stores-for-rails-4jhg).

> **Note**
> There's currently no way to configure the Websocket URL. At the moment it only works in the browser, with the default Rails configuration, on the same origin.

## Installation

### Ruby gem

Add this line to your application's Gemfile:

```ruby
gem 'actionstore'
```

And then execute:

    $ bundle install

### Npm package

Install the package:

    $ yarn add @buhrmi/actionstore

## Usage

Below are some usage examples. For more condensed details, see the [API section](#API).

### Subscribe to a database record

In a Svelte component:

```html
<script>
import {subscribe} from '@buhrmi/actionstore'

// you need the signed global id of the record you want to subscribe to
export let user_sgid

// Calling `subscribe` will set up an ActionCable subscription and return a 
// Svelte store which you can push to
const user = subscribe(user_sgid)
</script>

{#if $user}
  Hello {$user.name}
{/if}
```

Now you can populate the store from the backend:

```ruby
class User < ApplicationRecord
  has_actionstore

  def subscribed channel
    push_update name: 'Rich Harris'
  end
end
```

### Multiple stores

You can also push data into stores specified by an id

```js
import {subscribe,store} from '@buhrmi/actionstore'
export let user_sgid
const user = subscribe(user_sgid)

// Use the store() method to get an ActionStore by id
const messages = store('messages')

```

Now you can push into the "messages" store from the backend

```ruby
user.push_append_into 'messages', text: 'hello'
```

### Autopush changes

You can automatically sync record changes to the store.

```ruby
class User < ApplicationRecord
  has_actionstore
  
  # this will only push changed attributes
  after_update_commit -> { push_update saved_changes.transform_values(&:last) }
 end
```

### Perform actions

You can define actions directly on the model and call them from the frontend.

```js
const user = subscribe(user_sgid)
user.perform 'say_hello', 'thomas'
```

```ruby
class User < ApplicationRecord
  def perform_say_hello channel, name
    puts "Hello #{name}"
  end
end
```

### Authentication

The `subscribed`, `unsubscribed`, and `perform_...` methods all receive the ActionCable channel as the first argument. Use this  to check for authentication, eg:

```ruby
class User < ApplicationRecord
  def perform_say_hello channel, name
    return unless channel.current_user == self
    # do something...
  end
end
```

### Trigger events

```js
const user = subscribe(user_sgid)
user.on('show_alert', function(data) {
  window.alert(data)
})
```

```ruby
user.push_event 'show_alert', 'Boo!'
```



## API

ActionStore consists of two parts, the frontend (Javascript) part and the backend (Ruby) part. Find details below.

### Javascript

The `@buhrmi/actionstore` package exports the following functions:

`const someStore = subscribe(sgid, initial=null, storeId=sgid)` - Sets up a new subscription to the record with the specified global id. You can optionally pass a storeId. If a new subscription with the same storeId is created, the old subscription will be cancelled and removed. If `sgid` is falsy, `subscribe` will set the store value to `null`.

`const someStore = store(storeId, initial=null)` - Gets the store with the specified id.

#### Stores

ActionStores are Svelte stores augmented with the following functions:

`someStore.on(event, handler)` - Sets up an event handler for server-sent events

`someStore.perform(action, ...arguments)` - Will call the equivalent `perform_[action]` method on the subscribed model.

### Ruby

Adding `has_actionstore` to your ActiveRecord model (or anything else that can be located via [Global ID](https://github.com/rails/globalid)) will create the following instance methods and behavior

#### Pushing Data

`record.push_append(data)` - Append data to an array in the default store

`record.push_update(changes)` - Updats fields of an object in the default store

`record.push_update_by(key, value, changes)` - Updates fields of an object in the default store, identified by the specified key and value

`record.push_append_into(store_name, data)` - Append data to an array in a specified store

`record.push_update_into(store_name, changes)` - Update fields of an object in a specified store

`record.push_update_by_into(store_name, key, value, changes)` - Update fields of an object in a specified store, identified by the specified key and value

#### Triggering events

`record.push_event(event_name, data)` - Trigger an event on the default store

`record.push_event_into(store_name, event_name, data)` - Trigger an event on a specified store

#### Actions

Any method on the object that starts with `perform_` can potentially be called from the frontend. The first argument is always the channel that received the action (useful for authentication), followed by the arguments passed from the frontend.

#### Callbacks

Whenever a subscription is created or destroyed, the `subscribed(channel)` or `unsubscribed(channel)` method is called on the subject (if defined).
