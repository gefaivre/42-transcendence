<script lang="ts">
  import axios from "../../axios.config";
  import { user, reloadImage } from "../../stores";
  import { replace } from "svelte-spa-router";
  import { onMount } from "svelte";
  import { toast } from '@zerodevx/svelte-toast/dist'

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
    if (file === null || file === undefined) {
      toast.push('Empty file', { classes: ['failure'] })
      return
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("/images", formData, { headers: { "Content-Type": "multipart/form-data" } });
      getPPs();
      $reloadImage++;
    } catch (e) {
      toast.push(e.response.data.message, { classes: ['failure'] })
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
    if (username === null) {
      toast.push('Empty password', { classes: ['failure'] })
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

  async function validate2FA() {
    try {
      await axios.post('/auth/2FA/validate', { token: code2FA })
      qrcode = ''
      code2FA = ''
      $user.TwoFA = true;
      steptwo = false;
    } catch (e) {
      toast.push('Bad 2FA code', { classes: ['failure'] })
      console.log(e.response.data.message)
    }
  }

  async function enable2FA() {
    try {
      const response = await axios.patch(`/auth/2FA/enable`, null)
      qrcode = response.data
      steptwo = true;
    } catch (e) {
      console.log(e.response.data.message)
    }
  }

  async function disable2FA() {
    try {
      await axios.patch(`/auth/2FA/disable`, null)
      $user.TwoFA = false;
    } catch (e) {
      console.log(e.response.data.message)
    }
  }

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
