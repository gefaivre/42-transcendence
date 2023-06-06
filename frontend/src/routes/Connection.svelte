<script lang="ts">

  import axios from "../axios.config";
  import { push } from "svelte-spa-router";
  import { logged } from "../stores";
  import Logo42 from "../assets/42_Logo.png"
  import { toast } from '@zerodevx/svelte-toast/dist'
  import type { CreateUserDto } from "../types";

  let user: CreateUserDto = {
    username: null,
    password: null,
    ft_login: undefined
  }

  let action: string = ''
  let code: number = null

  function success2FA() {
    code = null
    toast.push('Welcome! 👋', { classes: ['success'] })
    logged.set('true')
    push('/')
  }

  function failure2FA() {
    code = null
    toast.push('Error', { classes: ['failure'] })
    logged.set('false')
  }

  async function validate2FA() {
    try {
      const response = await axios.post('/auth/2FA/login', { token: code })
      return response.data === true ? success2FA() : failure2FA()
    } catch (e) {
      console.log(e)
    }
  }

  async function login() {

    if (user.username === null) {
      toast.push('Empty username', { classes: ['failure'] })
      return
    }

    if (user.password === null) {
      toast.push('Empty password', { classes: ['failure'] })
      return
    }

    try {
      const response = await axios.post('/auth/login', user)
      console.log('response', response)
      if (response.data === 'jwt2fa') {
        action = 'qrcode';
      } else {
        toast.push('Welcome! 👋', { classes: ['success'] })
        user.username = null
        user.password = null
        logged.set('true')
        push('/')
      }
    } catch (e) {
      toast.push(e.response.data.message, { classes: ['failure'] })
      user.username = null
      user.password = null
    }
  }

  async function signup() {

    if (user.username === null) {
      toast.push('Empty username', { classes: ['failure'] })
      return
    }

    if (user.password === null) {
      toast.push('Empty password', { classes: ['failure'] })
      return
    }

    try {
      await axios.post('/auth/signup', user)
      toast.push('Signup success. Now you can login', { classes: ['success'] })
      user.username = null
      user.password = null
      action = '';
    } catch (e) {
      toast.push(e.response.data.message, { classes: ['failure'] })
      user.username = null
      user.password = null
    }
  }

</script>
<div class="screen">

  <h1 class="title">ft_transcendence</h1>

  {#if action === ''}
    <div class="action">
      <a href={FT_AUTHORIZE}>
        <div class="connect-button">
          <img src={Logo42} alt="logo 42">
        </div>
      </a>
      <button on:click={() => action = 'signup'}>
        <div class="connect-button">
          signup
        </div>
      </button>
      <button on:click={() => action = 'signin'}>
        <div class="connect-button">
          signin
        </div>
      </button>
    </div>

  {:else if action === 'signup'}
    <div class="action">
      <input type="text" placeholder="username" bind:value={user.username}><br>
      <input type="text" placeholder="password" bind:value={user.password}><br>
      <button on:click={signup}>signup</button>
      <button on:click={() => action = ''}>return</button>
    </div>

  {:else if action === 'signin'}
    <div class="action">
      <input type="text" placeholder="username" bind:value={user.username}><br>
      <input type="text" placeholder="password" bind:value={user.password}><br>
      <button on:click={login}>login</button>
      <button on:click={() => action = ''}>return</button>
    </div>

  {:else if action === 'qrcode'}
    <div class="action">
      <input type="text" inputmode="numeric" bind:value={code}>
      <button on:click={validate2FA}>2FA Validate</button>
      <button on:click={() => action = ''}>return</button>
    </div>

  {/if}


</div>
  <style>

  .screen {
    height: 100vh;
    display: grid;
    grid-template-rows: 1fr 240px 1fr;
    background-color: var(--grey);

  }

  .action {
    grid-row: 2/3;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    row-gap: 15px;
  }

  .title {
    grid-row: 1/2;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: monospace;
    font-size: 4em;
    color: var(--pink);
    text-shadow:  0 0 10px ;
  }

  .connect-button{
    height: 70px;
    width: 350px;
    border: solid 1px black;
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--lite-grey);
  }

  .action button {
    color: var(--white)
  }

  .connect-button img {
    height: 65px;
    width: 65px;
  }



</style>