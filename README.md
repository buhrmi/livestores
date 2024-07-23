# LiveStores

[![CircleCI](https://circleci.com/gh/buhrmi/livestores.svg?style=shield)](https://circleci.com/gh/buhrmi/livestores)
[![Gem Version](https://badge.fury.io/rb/livestores.svg)](https://rubygems.org/gems/livestores)
[![npm version](https://badge.fury.io/js/livestores.svg)](https://www.npmjs.com/package/livestores)

LiveStores make it easy to update Svelte stores in real-time through ActionCable.

## Example


### Notifications

In this example we take a look at how to display user notifications in real-time. 

First, create a channel that will be used to send notifications: `rails g channel UserChannel`:

```rb
class UserChannel < ApplicationCable::Channel
  def subscribed
    stream_for current_user
  end
end
```

#### Client Side

Set up a subscription and initialize a `notifications` store.

```js
import { subscribe, getStore } from 'livestores'
import { onDestroy } from 'svelte'

// Set up a subscription to the UserChannel
const channel = subscribe('UserChannel')

// Don't forget to unsubscribe when the component is destroyed
onDestroy(channel.unsubscribe)

// Get a reference to the notifications store and initialize it with an empty array
const notifications = getStore('notifications', [])

$: console.log($notifications)
```

#### Server side

Now you can server-side push directly into the `notifications` store through the UserChannel:

```rb
UserChannel[some_user].store('notifications').append({text: "Hello from Ruby"})
```

## Docs

Under construction

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

