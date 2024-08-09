# LiveStores

[![CircleCI](https://circleci.com/gh/buhrmi/livestores.svg?style=shield)](https://circleci.com/gh/buhrmi/livestores)
[![Gem Version](https://badge.fury.io/rb/livestores.svg)](https://rubygems.org/gems/livestores)
[![npm version](https://badge.fury.io/js/livestores.svg)](https://www.npmjs.com/package/livestores)

LiveStores are the missing link for real-time apps with Ruby on Rails and Svelte. With LiveStores you can easily update Svelte stores from Ruby.

## Example

Let's assume you have a web app and would like to display real-time notifications to your users. This can be easily done with LiveStores. We'll just add new notifications to a Svelte store. 

#### Client Side

Inside your component, set up a subscription and initialize a `notifications` store.

```html
<script>
import { subscribe, getStore } from 'livestores'
import { onDestroy } from 'svelte'

// Set up a subscription to the UserChannel
const channel = subscribe('UserChannel')

// Don't forget to unsubscribe when the component is destroyed
onDestroy(channel.unsubscribe)

// Get a reference to the notifications store and initialize it with an empty array
const notifications = getStore('notifications', [])
</script>

{#each $notifications as notification}
  <p>{notification.text}</p>
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

Now you can server-side push directly into the `notifications` store through the UserChannel:

```rb
UserChannel[some_user].store('notifications').append({text: "Hello from Ruby"})
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

