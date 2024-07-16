<script>
  import { subscribe, getStore } from "livestore"

  const UserChannel = subscribe('UserChannel')
  const user = getStore('user', {})
  const messages = getStore('messages', [])

  function makeMessage() {
    UserChannel.perform('make_message', {text:'Hello World'})
  }
</script>

<h1>{$user.name}</h1>

<h2>Messages</h2>

{#each $messages as message}
  {message}
{/each}

<button on:click={makeMessage}>Make Message</button>
