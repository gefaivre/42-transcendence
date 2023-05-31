<script lang="ts">
  import axios from "../../axios.config";
  import { user, reloadImage } from "../../stores";
  import { replace } from "svelte-spa-router";
  import { onMount } from "svelte";

  let fileInput: any = null;

  let images = [];

  let username: string = null;
  let password: string = null;

  let qrcode: string = '';
  let code2FA: string = '';
  let steptwo: boolean = false;

  onMount(() => getPPs());

  async function addPP() {

    const file = fileInput.files[0];
    if (file === null || file === undefined)
      return alert("empty file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("/images", formData, { headers: { "Content-Type": "multipart/form-data" } });
      getPPs();
      $reloadImage++;
    } catch (e) {
      console.error(e);
    }
  }

  async function getPPs() {
    try {
      const response = await axios.get('/images')
      images = response.data
      getPPs()
    } catch(e) {
      console.log(e);
    }
  }

  async function updatePP(id: number) {
    try {
      await axios.patch(`/images/${id}`)
      $reloadImage++;
    } catch(e) {
      console.log(e);
    }
  }

  async function deletePP(id: number) {
    try {
      await axios.delete(`/images/${id}`)
      images = images.filter((image: any) => image.id !== id)
    }  catch(e) {
      console.log(e)
    }
  }

  async function updateUsername() {
    // guards
    if (username === null) {
      return alert("empty username");
    }
    if (username === $user.username) {
      return alert("same username");
    }

    try {
      await axios.patch("/users/username", { username: username });

      alert("Username successfully updated!");

      // update component state
      $user.username = username;
      username = null;

      // redirect to your new user page
      replace(`/users/${$user.username}`);
    } catch (error) {
      alert(error.response.data.message);
    }
  }

  async function validate2FA() {
        try {
            await axios.post('http://localhost:3000/auth/2FA/validate', { token: code2FA }, { withCredentials: true })
            qrcode = ''
            code2FA = ''
            // getUser()
            $user.TwoFA = true;
            steptwo = false;
          } catch (error) {
            alert('Bad 2fa code')
            console.log(error.response.data.message)
          }
        }
        async function enable2FA() {
          try {
            const response = await axios.patch(`http://localhost:3000/auth/2FA/enable`, null, { withCredentials: true })
            qrcode = response.data
            steptwo = true;
        } catch (error) {
            console.log(error.response.data.message)
        }
    }
    async function disable2FA() {
        try {
            await axios.patch(`http://localhost:3000/auth/2FA/disable`, null, { withCredentials: true })
            // getUser()
            $user.TwoFA = false;
        } catch (error) {
            console.log(error.response.data.message)
        }
    }

  // before update, password displayed in table is the hash
  // after update, password displayed in table is in clear
  // you'll need to refresh the page to see the new password in its hashed version
  // this is not big deal since this table entry will be removed anyway
  async function updatePassword() {
    // guards
    if (password === null) {
      return alert("empty password");
    }
    try {
      await axios.patch("/users/password", { password: password });

      alert("Password successfully updated!");

      // update component state
      $user.password = password;
      password = null;

      // redirect to your new user page
      replace(`/users/${$user.username}`);
    } catch (error) {
      alert(error.response.data.message);
    }
  }
</script>

<div class="settings-container">
  <h1 class="title">Settings</h1>

  <div class="box-info image">
    <h1>Change your pp</h1>
    <div class="image-list">
      {#each images as image}
      <div class="imageContainer">
        <div>
          <button class="hidden-button" on:click={() => updatePP(image.id)}>
            <img class="pp" src="http://localhost:3000/images/{image.id}" alt={image.name}/>
          </button>
        </div>
        <div class="imageButton">
          <button on:click={() => deletePP(image.id)}>delete</button>
        </div>
      </div>
      {/each}
      <form class="form" on:change|preventDefault={addPP}>
        <label for="file-upload">
          Add Image
          <input bind:this={fileInput} type="file" style="visibility: hidden;" id="file-upload"/>
        </label>
      </form>
    </div>
  </div>

  <div class="box-info username">
    <h1>change your username</h1>
    <div class="content">
      <input type="text" placeholder="new username" bind:value={username} />
      <button on:click={updateUsername}>Update</button>
    </div>
  </div>

  <div class="box-info twofa">
      {#if $user.TwoFA === false && steptwo === false}
        <button on:click={enable2FA}>Enable TWOFA</button>
      {:else if qrcode !== ''}
        <img alt='qrcode' src={qrcode}>
        <input type="text" placeholder="code" bind:value={code2FA}>
        <button on:click={validate2FA}>Validate</button>
      {:else}
        <button on:click={disable2FA}>Disable TWOFA</button>
      {/if}
  </div>
</div>

<style>
  .settings-container {
    display: grid;
    grid-template-columns: 3fr 2fr;
    grid-template-rows: 150px repeat(2, 1fr);
    background-color: var(--grey);
    height: 100vh;
  }

  .title {
    grid-column: 1 / 3;
    grid-row: 1 / 2;
    font-size: 50px;
    text-shadow: 0 0 20px;
    font-family: "Courier New", Courier, monospace;
    letter-spacing: 0.5px;
    color: var(--pink);
    margin-top: 50px;
  }

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

  .image {
    grid-column: 1 / 2;
    grid-row: 2 / 4;
    min-width: 140px;
    width: 80%;
    height: 80%;
    place-self: center;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .username {
    grid-row: 2 / 3;
    grid-column: 2 / 3;
    place-self: center;
    width: 250px;
    height: 100px;
  }

  .twofa {
    display:flex ;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 250px;
    height: 280px;

    margin: auto;
  }

  .twofa img {
    width: 210px;
    height: 210px;
  }


  .image-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    grid-gap: 1em;
    justify-items: center;
  }

  .image-list .pp {
    width: 100px;
    height: 100px;
    cursor: pointer;
  }

  form {
    height: 100px;
    width: 100px;
  }

  label {
    display: inline-block;
    width: 100px;
    height: 100px;
    border: solid 2px var(--black);
    cursor: crosshair;
    background-color: var(--white);
    font-size: 30px;
    text-align: center;
  }

  .image-list .pp:hover {
    -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
    -moz-box-sizing: border-box; /* Firefox, other Gecko */
    box-sizing: border-box; /* Opera/IE 8+ */
    border: 2px solid #333;
  }

  .hidden-button {
    height: 100px;
    width: 100px;
    border: none;
    outline: none;
    box-shadow: none;
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

  .imageButton button {
    border: solid 1px black;
    background-color: white;
    border-radius: 10px;
    color: black;
    padding-left: 5px;
    padding-right: 5px;
  }

  /* ===== Scrollbar CSS ===== */
  /* Firefox */
  * {
    scrollbar-width: 7px;
    scrollbar-color: var(--pink);
  }

  /* Chrome, Edge, and Safari */
  *::-webkit-scrollbar {
    width: 7px;
  }

  *::-webkit-scrollbar-track {
    background: transparent;
  }

  *::-webkit-scrollbar-thumb {
    background-color: var(--pink);
    border-radius: 10px;
  }
</style>
