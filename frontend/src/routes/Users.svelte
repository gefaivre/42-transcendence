<script lang="ts">


  import { user} from "../stores";

  import UsersInfo from "./usersComponents/UsersInfo.svelte";
  import UsersSettings from "./usersComponents/UsersSettings.svelte";

    let reloadImage: number = 0

    let settings: boolean = false;


</script>

  <div class="component">
    <div class="userPanel">

      <h1 class="title">Profile</h1>

      <button class="clickableImageButton" on:click={() => settings = !settings}>
        <img class="userImage" src="http://localhost:3000/images/actual/{$user.id}?$reload=${reloadImage}" alt="profil">
      </button>

      <button class="clickableUsernameButton" on:click={() => settings = !settings}>
        <span class="username">{$user.username}</span>
      </button>

      <button class="clickableTwofaButton" on:click={() => settings = !settings}>
        <p class="twofa">Your 2FA  is not activated</p>
      </button>

    </div>

    <div class="secondPanel">
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

  .userPanel {
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

  .secondPanel {
    grid-column: 2 / 3;
  }

  .title {
    font-size: 50px;
    text-shadow: 0 0 20px;
    font-family: 'Courier New', Courier, monospace;
    letter-spacing: 0.5px;
    color: var(--pink);
  }
  .clickableImageButton {
    position: relative;
    pointer-events: none;

  }

  .clickableImageButton:after {
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

  .userImage {
    border-radius: var(--imageRadius);
    height: 200px;
    width: 200px;
    position: relative;
    pointer-events: none;
  }

  .clickableUsernameButton {
    position: relative;
    pointer-events: none;
  }

  .username {
    font-size: 50px;
    color: var(--white);

  }

  .clickableUsernameButton:after {
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

  .twofa {
    color: var(--white);
  }

  .clickableTwofaButton {
    position: relative;
  }

  .clickableTwofaButton:after {
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

</style>
