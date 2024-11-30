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
const subscription = subscribe('MessagesChannel')

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
UserChannel[some_user].store('messages').append({text: "Hello from Ruby"})
```

## Docs

Full docs coming soon.

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

