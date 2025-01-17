<script>
  import { subscribe, getStore } from "livestores"

  subscribe('UserChannel')

  import axios from 'axios'

  const user = getStore('user', {})
  const messages = getStore('messages', [])
  const records = getStore('records', [{id:1, name: "old"}])

  $: console.log($messages)

  function makeMessage() {
    axios.post('/messages', { message: 'Hello World' })
  }
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

<button on:click={makeMessage}>Make Message</button>
