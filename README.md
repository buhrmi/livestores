# ActiveState

[![CircleCI](https://circleci.com/gh/buhrmi/activestate.svg?style=shield)](https://circleci.com/gh/buhrmi/activestate)
[![Gem Version](https://badge.fury.io/rb/activestate.svg)](https://rubygems.org/gems/activestate)
[![npm version](https://badge.fury.io/js/activestate.svg)](https://www.npmjs.com/package/activestate)

ActiveState explores the idea of having your entire application state inside one giant Svelte 5  `$state` object that can be updated from the backend. For this purpose, ActiveState augments your ActionCable Channels with methods to mutate this giant state object in real-time via [JSONPath](https://en.wikipedia.org/wiki/JSONPath). This works because after querying your giant JSON object using JSONPath, Svelte 5's reactivity is still in-tact on the result nodes, which the mutations are being applied to.

## Example

Let's assume you have a web app and would like to display real-time messages to a specific user. This can be easily done with ActiveState by pushing new messages to a centralized state object as they happen. Let's have a look:

### Set up

First, we of course need a channel that we can subscribe to:

```rb
# user_channel.rb
class UserChannel < ApplicationCable::Channel
  def subscribed
    stream_for current_user
  end
end
```

Then, inside your component, set up a subscription and iterate over `state.messages`.

```svelte
<script>
import { subscribe, State } from 'activestate'
import { onDestroy } from 'svelte'

// Set up a subscription to the UserChannel
const unsubscribe = subscribe('UserChannel', {user_id: something})

// Don't forget to unsubscribe when the component is destroyed
onDestroy(unsubscribe)

// Iinitialize it with an empty array
State.messages ||= []
const messages = $derived(State.messages)
</script>

{#each messages as message}
  <p>{message.text}</p>
{/each}
```

Now you can server-side push directly into `state.messages` through the UserChannel (the `$.` can be ommitted):

```rb
# Somewhere in your Ruby code:
UserChannel[some_user].state('messages').push({text: "Hello from Ruby", id: 12})
```

Or, update the text of a specific message:

```rb
UserChannel[some_user].state('messages[?(@.id==12)]').assign({text: "Other text"})
```


## Mutating state

ActiveState comes with 4 built-in mutators to mutate state on the client: `set`, `assign`, `upsert`, and `delete` (by the way, when did people start saying "mutating" instead of "updating"?):

#### `set(data)`

```rb
UserChannel[some_user].state('current_user.name').set("John")
```

Replaces the value of `current_user.name` with `John`. The `set` mutator does not accept JSONPath. It uses simple dot-notation.

#### `assign(data)`

```rb
UserChannel[some_user].state('current_user').assign({name: 'new name'})
```

Uses `Object.assign` to assign the passed object onto `current_user`.

#### `upsert(data, key = "id")`

```rb
UserChannel[some_user].state('current_user.notices').upsert([{id: 4, name: "new name"}])
```

This iterates over the array in `current_user.notices`, and performs an upsert using specified key

#### `delete({key: val})`

If called on an array, it iterates over the array and deletes all entries who's keys match the provided object.

#### `delete(key)`

If called on an object, it deletes they provided key on the object

### Native mutators

You can also call functions that "natively" exist on objects in the state. For example, if you have an array in `current_user.notices`, you can call its native `push` function:

```ruby
UserChannel[some_user].state('current_user.notices').push "next chunk"
```

### Custom mutators

You can also define custom methods to mutate your state.

```svelte
<script>
import { registerMutator, State } from 'activestate'

registerMutator('append', function(target, data) {
  target[data.key] += data.value
})
</script>

<p>
Here is a very long string: {State.long_string}
</p>
```

```ruby
UserChannel[some_user].state('$').append(key: "long_string", value: "i am being appended")
```

### Hooks

You can intercept the mutation of the State by setting hooks on path prefixes. These allow you to
stop mutators from running (by returning false), or otherwise use the data.

```js
import { registerHook } from 'activestate'

registerHook('current_user.messages', function(path, action, data) {
  if (data.text.includes("sensitive")) return false
})
```

### Send using a specific connection

The `state` method is also available on a Channel instance. That means that you can update Svelte stores through a specific connection, instead of broadcasting to all subscribers:

```rb
# user_channel.rb
class UserChannel < ApplicationCable::Channel
  def subscribed
    stream_for current_user
    state('current_user').set(current_user.as_json)
  end
end
```

### SSR

When using ActiveState in an SSR context, the server-side javascript process is usually shared between requests. Therefore it is of importance to call `reset()` before or after rendering, to clear the state and avoid any data leakage between requests.

```js
import { reset } from 'activestate'

reset()

// ... rest of code comes here
```

## FAQ

### Is it smart to put all application state into a single global state object?

Not sure. Svelte 5 introduced fine-grained reactivity on `$state` objects. That means, that even if you have one ginormous state object, Svelte only re-evaluates code branches that depend on the parts that actually changed. So it's worth a try to do things this way.

## Installation

### Ruby gem

Add this line to your application's Gemfile:

```ruby
gem 'activestate'
```

And then execute:

    $ bundle install

### Npm package

Install the package:

    $ npm i -D activestate

