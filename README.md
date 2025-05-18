# LiveStores

[![CircleCI](https://circleci.com/gh/buhrmi/livestores.svg?style=shield)](https://circleci.com/gh/buhrmi/livestores)
[![Gem Version](https://badge.fury.io/rb/livestores.svg)](https://rubygems.org/gems/livestores)
[![npm version](https://badge.fury.io/js/livestores.svg)](https://www.npmjs.com/package/livestores)

LiveStores augments your ActionCable channels with methods to easily update Svelte stores directly from your backend.

## Example

Let's assume you have a web app and would like to display real-time messages to a specific user. This can be easily done with LiveStores by pushing new messages to a Svelte store as they happen. Let's have a look:

#### Client Side

Inside your component, set up a subscription and initialize a `messages` store.

```html
<script>
import { subscribe, getStore } from 'livestores'
import { onDestroy } from 'svelte'

// Set up a subscription to the UserChannel
// (You can also subscribe with params: subscribe('SomeChannel', {someparam: 123}))
const subscription = subscribe('UserChannel')

// Don't forget to unsubscribe when the component is destroyed
onDestroy(subscription.unsubscribe)

// Get a reference to the messages store and optionally initialize it with an empty array
const messages = getStore('messages', [])
</script>

{#each $messages as message}
  <p>{message.text}</p>
{/each}
```

#### Server side

On the Ruby side, we of course need a channel that we can subscribe to:

```rb
# user_channel.rb
class UserChannel < ApplicationCable::Channel
  def subscribed
    stream_for current_user
  end
end
```

Now you can server-side push directly into the `messages` store through the UserChannel:

```rb
UserChannel[some_user].store('messages').merge([{text: "Hello from Ruby"}])
```

## Usage

### Backend

LiveStores comes with 3 built-in methods that you can use to update stores on the client: `set`, `merge`, and `upsert`:

#### `set(data)`

```rb
UserChannel[some_user].store('current_user').set(current_user.as_json)
```

This replaces the value of store with whatever is passed to the method.

#### `merge(data)`

```rb
UserChannel[some_user].store('current_user').merge({name: 'new name'})
```

This deeply merges the value of the store with whatever is passed to the method. If the deep merge encounters arrays, they will be concatenated.

#### `upsert(data, key = "id")`

```rb
UserChannel[some_user].store('projects').upsert([{id: 4, name: "new name"}])
```

This is basically the same as `merge`, but instead of concatenating arrays, it upserts the objects inside the array, using specified `key` (`id` by default).

### Custom methods

You can also define custom methods to update your stores.

```js
import { registerHandler } from 'livestores'

registerHandler('concat', function(store, data) {
  store.update(current => `${current}${data}`)
})

const longString = getStore('long_string', "initial string")
```

```ruby
UserChannel[some_user].store('long_string').concat "next chunk"
```

### Send using a specific connection

The `store` method is also available on a Channel instance. That means that you can update Svelte stores through a specific connection, instead of broadcasting to all subscribers:

```rb
# user_channel.rb
class UserChannel < ApplicationCable::Channel
  def subscribed
    stream_for current_user
    store('current_user').set(current_user.as_json)
  end
end
```

### SSR

When using LiveStores in an SSR context, it is very important to call `reset()` before or after rendering, to clear the stores and avoid any data leakage between requests.

```js
import { reset } from 'livestores'

reset()

// ... rest of code comes here
```

## TODO

- [ ] Cache store data locally for offline support

## Installation

### Ruby gem

Add this line to your application's Gemfile:

```ruby
gem 'livestores'
```

And then execute:

    $ bundle install

### Npm package

Install the package:

    $ npm i -D livestores

