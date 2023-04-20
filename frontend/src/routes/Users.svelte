<script lang="ts">


  import { user} from "../stores";

  import UsersInfo from "./usersComponents/UsersInfo.svelte";
  import UsersSettings from "./usersComponents/UsersSettings.svelte";

    let reloadImage: number = 0

    let settings: boolean = false;


</script>

  <div class="component">
    <div class="userPanel">

      <h1 class="componentName">Profile</h1>

      <div class="clickableImage">
        <button on:click={() => settings = !settings}>
          <img class="userImage" src="http://localhost:3000/images/actual/{$user.id}?$reload=${reloadImage}" alt="profil">
        </button>
      </div>
      <!-- {#if $id === $user.id.toString() }
        <ChangePp bind:reloadImage={reloadImage} />
        {/if} -->

      <span class="username">{$user.username}</span>
      <div class="twofa">
        <input type="checkbox"> <span>2fa?</span>
      </div>

    </div>

    {#if settings}
      <UsersSettings/>
    {:else}
      <UsersInfo/>
    {/if}



      <!-- <table>
        <tbody>
          <tr>
            <td>id</td> <td>{$user.id}</td>
          </tr>
          <tr>
            <td>Username</td> <td>{$user.username}</td>
          </tr>
          <tr>
                <td>Password</td> <td>{$user.password}</td>
              </tr>
              <tr>
                <td>Games played</td> <td>{$user.games}</td>
              </tr>
              <tr>
                <td>Mmr</td> <td>{$user.mmr}</td>
              </tr>
              <tr>
                <td>42 login</td> <td>{$user.ft_login}</td>
              </tr>
            </tbody>
          </table>

          <br>
          <br>

          {#if $id === $user.id.toString()}
          <input type="text" placeholder="new username" bind:value={username}>
          <button on:click={updateUsername}>Update</button>
          <br>
          <input type="text" placeholder="new password" bind:value={password}>
          <button on:click={updatePassword}>Update</button>
          {/if} -->


  </div>
<style>


  .component {
    height: 100vh;
    display: grid;
    grid-template-columns: 320px 1fr;
    background-color: var(--black);
  }

  .componentName {
    font-size: 50px;
    text-shadow: 0 0 20px;
    font-family: 'Courier New', Courier, monospace;
    letter-spacing: 0.5px;
    color: var(--pink);
  }

  .userPanel {
    height: 100vh;
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    align-items: center;
    background-color: var(--grey);
    border: solid 1px var(--lite-grey);
    border-top-width: 0;
    border-bottom-width: 0;

  }

  .userImage {
    border-radius: var(--imageRadius);
    height: 200px;
    width: 200px;
  }


  .clickableImage:after {
    content: "\2699";
    color: white;
  }

  .username {

    font-size: 50px;
    color: var(--white);
    /* grid-column: 3/4;
    grid-row: 1/3; */
  }
  .twofa {
    color: var(--white);
  }

</style>
