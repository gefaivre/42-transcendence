<script lang="ts">

  import Images from "../user-settings/Images.svelte";
  import Password from "../user-settings/Password.svelte";
  import Twofa from "../user-settings/Twofa.svelte";
  import Username from "../user-settings/Username.svelte";

  let tab: string = 'images'

</script>

<div class="box-info">
  <div class="nav">
    {#if tab === 'images'}
      <button class="activeButton" on:click={() => tab = 'images'}>images</button>
    {:else}
      <button on:click={() => tab = 'images'}>images</button>
    {/if}
    {#if tab === '2FA'}
      <button class="activeButton" on:click={() => tab = '2FA'}>2FA</button>
    {:else}
      <button on:click={() => tab = '2FA'}>2FA</button>
    {/if}
    {#if tab === 'username'}
      <button class="activeButton" on:click={() => tab = 'username'}>username</button>
    {:else}
      <button on:click={() => tab = 'username'}>username</button>
    {/if}
    {#if tab === 'password'}
      <button class="activeButton" on:click={() => tab = 'password'}>password</button>
    {:else}
      <button on:click={() => tab = 'password'}>password</button>
    {/if}
  </div>

  {#if tab === 'images'}
    <Images/>
  {:else if tab === '2FA'}
    <Twofa/>
  {:else if tab === 'username'}
    <Username/>
  {:else if tab === 'password'}
    <Password/>
  {:else}
    yolo
  {/if}

</div>

<style>

.box-info {
  border: solid 2px var(--grey);
  box-shadow: 0 0 10px var(--lite-grey);
  background-color: var(--lite-grey);
  border-radius: 20px;
  height: 80%;
  width: 80%;
  display: flex;
  flex-direction: column;
}

.box-info .nav {
  height: 40px;
  display: flex;
  justify-content: space-around;
}

.box-info .nav button {
  border-bottom: solid 1px var(--black);
  flex: auto;
}

.box-info .nav .activeButton {
  border-bottom: none;
}

.box-info .nav button:not(:last-child) {
  border-right: solid 1px var(--black);
}

</style>