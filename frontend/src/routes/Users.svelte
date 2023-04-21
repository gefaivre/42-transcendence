<script lang="ts">


  import { user} from "../stores";

  import UsersInfo from "./usersComponents/UsersInfo.svelte";
  import UsersSettings from "./usersComponents/UsersSettings.svelte";

    let reloadImage: number = 0

    let settings: boolean = false;


</script>

<div class="component">
  <div class="user-panel">

    <h1 class="title">Profile</h1>

    <button class="image-button" on:click={() => settings = !settings}>
      <img class="image" src="http://localhost:3000/images/actual/{$user.id}?$reload=${reloadImage}" alt="profil">
    </button>

    <button class="username-button" on:click={() => settings = !settings}>
      <span class="username">{$user.username}</span>
    </button>

    <button class="twofa-button" on:click={() => settings = !settings}>
      <p class="twofa">Your 2FA  is not activated</p>
    </button>

  </div>

  <div class="second-panel">
    {#if settings}
      <UsersSettings reloadImage={reloadImage}/>
    {:else}
      <UsersInfo/>
    {/if}
  </div>

</div>

<style>

  .component {
    height: 100vh;
    display: grid;
    grid-template-columns: 320px 1fr;
    background-color: var(--black);
  }

  .user-panel {
    height: 100%;
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    align-items: center;
    background-color: var(--grey);
    border: solid 1px var(--lite-grey);
    border-top-width: 0;
    border-bottom-width: 0;

  }


  .user-panel .title {
    font-size: 50px;
    text-shadow: 0 0 20px;
    font-family: 'Courier New', Courier, monospace;
    letter-spacing: 0.5px;
    color: var(--pink);
  }

  .user-panel .image-button {
    position: relative;
    pointer-events: none;

  }

  .user-panel .image-button:after {
    position: absolute;
    content: "\2699";
    font-size: 1.5em;
    pointer-events: all;
    height: 40px;
    width: 40px;
    background-color: var(--lite-grey);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    left: 100%;
    top: 0;
    transform: translate(-110%, 0px);
  }

  .user-panel .image-button .image {
    border-radius: var(--imageRadius);
    height: 200px;
    width: 200px;
    position: relative;
    pointer-events: none;
    border: solid 6px var(--lite-grey);
  }

  .user-panel .username-button {
    position: relative;
    pointer-events: none;
  }

  .user-panel .username-button .username {
    font-size: 50px;
    color: var(--white);

  }

  .user-panel .username-button:after {
    position: absolute;
    content: "\2699";
    font-size: 1.2em;
    pointer-events: all;
    height: 30px;
    width: 30px;
    background-color: var(--lite-grey);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    left: 100%;
    top: 0;


  }

  .user-panel .twofa-button .twofa {
    color: var(--white);
  }

  .user-panel .twofa-button {
    position: relative;
  }

  .user-panel .twofa-button:after {
    position: absolute;
    content: "\2699";
    font-size: 1.2em;
    pointer-events: all;
    height: 30px;
    width: 30px;
    background-color: var(--lite-grey);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    left: 100%;
    top: 0;
    transform: translate(6px, -20px);
  }

  .second-panel {
    grid-column: 2 / 3;
  }

</style>
