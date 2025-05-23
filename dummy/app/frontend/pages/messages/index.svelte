<script>
  import { subscribe, getStore, registerHandler } from "livestores"

  subscribe('UserChannel')

  import axios from 'axios'

  const user = getStore('user', {})
  const messages = getStore('messages', [])
  const records = getStore('records', [{id:1, name: "old"}])
  const largeNumber = getStore('large_number', 5)
  const word = getStore('word', 'hello')
  const obj = getStore('object', {value: 'old'})

  $: console.log($messages)

  function makeMessage() {
    axios.post('/messages', { message: 'Hello World' })
  }

registerHandler('concat', function(store, data) {
  store.update(_data => _data.concat(data))
})
  
registerHandler('keepLarger', function(store, data) {
  store.update(_data => _data >= data.value ? _data : data.value)
})
</script>

<h1>{$user.name}</h1>

<h2>Messages</h2>

{#each $messages as message}
  {message}
{/each}

<h2>records</h2>

{#each $records as record}
  {record.name}
{/each}

<h2>
Large Number: {$largeNumber}
</h2>

<h2>
  Long word: {$word}
</h2>

<h2>
Object value: {$obj.value}
</h2>

<button on:click={makeMessage}>Make Message</button>
