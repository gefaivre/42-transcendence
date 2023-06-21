<script lang="ts">

  import type { User } from "../../../types";
  import Images from "../user-settings/Images.svelte";
  import Password from "../user-settings/Password.svelte";
  import Twofa from "../user-settings/Twofa.svelte";
  import Username from "../user-settings/Username.svelte";

  const enum Tab {
    Images,
    TwoFA,
    Username,
    Password
  }

  let tab: Tab = Tab.Images

  export let pageUser: User

</script>

<div class="box-info">
  <div class="nav">
    <button on:click={() => tab = Tab.Images} class={tab === Tab.Images ? 'activeButton': undefined}>Images</button>
    <button on:click={() => tab = Tab.TwoFA} class={tab === Tab.TwoFA ? 'activeButton': undefined}>2FA</button>
    <button on:click={() => tab = Tab.Username} class={tab === Tab.Username ? 'activeButton': undefined}>Username</button>
    {#if pageUser.ft_login === null}
    <button on:click={() => tab = Tab.Password} class={tab === Tab.Password ? 'activeButton': undefined}>Password</button>
    {/if}
  </div>

  {#if tab === Tab.Images}
    <Images/>
  {:else if tab === Tab.TwoFA}
    <Twofa/>
  {:else if tab === Tab.Username}
    <Username/>
  {:else if tab === Tab.Password && pageUser.ft_login === null}
    <Password/>
  {:else}
    yolo
  {/if}

</div>

<style>

.box-info {
  background-color: var(--lite-grey);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  height: var(--panel-height);
  width: var(--panel-width);
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