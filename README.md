# ActionStore

ActionStore allows you to push data directly into Svelte stores from your Ruby on Rails backend.

## Installation

Add this line to your application's Gemfile:

```ruby
gem 'actionstore'
```

And then execute:

    $ bundle install


## Usage

Below are some example usage scenarios. For more details, see the [API documentation](https://www.rubydoc.info/gems/actionstore).

### Subscribe to a database record

In a Svelte component:

```html
<script>
import {subscribe} from ‘actionstore’

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
  include ActionStore

  def subscribed channel
    push_update name: ‘Rich Harris’
  end
end
```

### Multiple stores

You can also push data into stores specified by an id

```js
import {subscribe,store} from ‘actionstore’
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
  include ActionStore
  
  # this will only push changed attributes
  after_update_commit -> { push_update saved_changes.transform_values(&:last) }
 end
```

### Perform actions

With ActionStore you can define actions directly on the model and call them from the frontend.

```js
const user = subscribe(user_sgid)
user.perform 'say_hello', 'thomas'
```

```ruby
class User
  def perform_say_hello channel, name
    puts "Hello #{name}"
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

ActionStore has just a couple of methods that cover a whole spectrum of stuff you can do.

### Frontend

`subscribe(sgid, initial=null, storeId=sgid)` - Subscribe to the record with the specified global id

`store(storeId, initial=null)` - Get the store with the specified id

### Backend

`push_append` - Append data to an array in the default store

`push_update` - Updats fields of an object in the default store

`push_append_into` - Append data to an array in a specified store

`push_update_into` - Update fields of an object in a specified store

`push_event` - Trigger an event on the default store

`push_event_into` - Trigger an event on a specified store

