<script>
  import { subscribe, store } from "@buhrmi/actionstore"
  export let user_sgid
  const user = subscribe(user_sgid, {})
  const messages = store('messages', [])

  function makeMessage() {
    user.perform('make_message', 'Hello World')
  }
</script>

<h1>{$user.name}</h1>

<h2>Messages</h2>

{#each $messages as message}
  {message.text}
{/each}

<button on:click={makeMessage}>Make Message</button>
