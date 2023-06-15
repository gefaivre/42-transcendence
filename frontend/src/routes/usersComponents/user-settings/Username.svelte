<script lang="ts">
  import axios from "../../../axios.config";
  import { user } from "../../../stores";
  import { replace } from "svelte-spa-router";
  import { toast } from '@zerodevx/svelte-toast/dist'

  let username: string = null;

  async function updateUsername() {
    if (username === null) {
      toast.push('Empty username', { classes: ['failure'] })
      return
    }
    if (username === $user.username) {
      toast.push('Same username', { classes: ['failure'] })
      return
    }

    try {
      await axios.patch("/users/username", { username: username });
      toast.push('Username successfully updated!', { classes: ['success'] })
      $user.username = username;
      username = null;
      replace(`/users/${$user.username}`);
    } catch (e) {
      toast.push(e.response.data.message, { classes: ['failure'] })
    }
  }

</script>

<div class="username">

    <h1>Change your username</h1>
    <div class="content">
      <input type="text" placeholder="new username" bind:value={username} />
      <button on:click={updateUsername}>Update</button>
    </div>
  </div>

<style>

  h1 {
    color: var(--white);
    text-align: center;
  }

  .username {
    place-self: center;
    width: 250px;
    height: 100px;
  }

  .username .content {
    margin-top: 5%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }

  .username .content input {
    border-radius: 10px;
  }

</style>
