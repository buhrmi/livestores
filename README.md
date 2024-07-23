# LiveStores

[![CircleCI](https://circleci.com/gh/buhrmi/livestores.svg?style=shield)](https://circleci.com/gh/livestores)
[![Gem Version](https://badge.fury.io/rb/livestores.svg)](https://rubygems.org/gems/livestores)
[![npm version](https://badge.fury.io/js/livestores.svg)](https://www.npmjs.com/package/livestores)

LiveStores make it easy to update Svelte stores in real-time through ActionCable.

## Example

Subscribe to an ActionCable Channel: 

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

To push a notification into the `notifications` store:

```rb
UserChannel[current_user].store('notifications').append({text: "Hello from Ruby"})
```

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

