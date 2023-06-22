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
    <button on:click={() => tab = Tab.Images} class={tab === Tab.Images ? 'activeButton left': 'left'}>Images</button>
    <button on:click={() => tab = Tab.TwoFA} class={tab === Tab.TwoFA ? 'activeButton': undefined}>2FA</button>
    <button on:click={() => tab = Tab.Username} class={tab === Tab.Username ? 'activeButton': undefined}>Username</button>
    {#if pageUser.ft_login === null}
    <button on:click={() => tab = Tab.Password} class={tab === Tab.Password ? 'activeButton right': 'right'}>Password</button>
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
  border-radius: var(--panel-radius);
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
    flex: auto;
    font-family: Courier, monospace;
    color: var(--orange);
    background-color: var(--grey);
  }

  .box-info .nav button:hover {
    text-decoration: underline;
  }
  .box-info .nav .activeButton {
    font-weight:bold;
  }

  .box-info .nav button:not(:last-child) {
    border-right: solid 1px var(--black);
  }

  .left {
    border-top-left-radius: var(--panel-radius);
  }

  .right {
    border-top-right-radius: var(--panel-radius);
  }

</style>
