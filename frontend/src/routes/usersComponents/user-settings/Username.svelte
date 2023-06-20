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

<div class="overflow">
  <br>
  <br>
  <h1>Change your username</h1>
  <div class="content">
    <input type="text" placeholder="new username" class="input-bordered w-full max-w-xs" />
    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" on:click={() => updateUsername()}>Update</button>
  </div>
</div>

<style>

  h1 {
    color: var(--white);
    text-align: center;
  }

  .overflow {
    place-self: center;
    flex: 1;
  }

</style>
