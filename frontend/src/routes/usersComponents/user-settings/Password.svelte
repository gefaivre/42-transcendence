<script lang="ts">
  import axios from "../../../axios.config";
  import { user } from "../../../stores";
  import { replace } from "svelte-spa-router";
  import { toast } from "@zerodevx/svelte-toast/dist";

  let password: string = null;

  async function updatePassword() {
    if (password === null) {
      toast.push('Empty password', { classes: ['failure'] })
      return
    }
    try {
      await axios.patch("/users/password", { password: password });
      toast.push('Password successfully updated!', { classes: ['success'] })
      $user.password = password;
      password = null;
      replace(`/users/${$user.username}`);
    } catch (e) {
      console.log(e.response.data.message);
    }
  }

</script>

<div class="overflow">
  <br>
  <br>
  <h1>Change your password</h1>
  <div class="content">
    <input type="text" placeholder="new username" class="input-bordered w-full max-w-xs" />
    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" on:click={() => updatePassword()}>Update</button>
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
