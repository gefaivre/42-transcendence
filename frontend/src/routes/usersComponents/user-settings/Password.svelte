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

<div class="box-info password">
  <h1>Change your password</h1>
  <div class="content">
    <input type="text" placeholder="new password" bind:value={password} />
    <button on:click={updatePassword}>Update</button>
  </div>
</div>

<style>

	h1 {
    color: var(--white);
    text-align: center;
  }

  .box-info {
    border: solid 2px var(--grey);
    box-shadow: 0 0 10px var(--lite-grey);
    background-color: var(--lite-grey);
    border-radius: 30px;
  }
  .password {
    place-self: center;
    width: 250px;
    height: 100px;
  }
  .password .content {
    margin-top: 5%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }

  .password .content input {
    border-radius: 10px;
  }

</style>
