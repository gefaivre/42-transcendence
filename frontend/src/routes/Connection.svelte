<script lang="ts">

  import axios from "../axios.config";
  import { push, replace } from "svelte-spa-router";
  import { logged } from "../stores";
  import Logo42 from "../assets/42_Logo.png"

  // cf. /backend/src/users/dto/create-user.dto.ts
  type CreateUserDto = {
    username: string
    password: string
    ft_login: string
  }

  let createUserDto: CreateUserDto = {
    username: null,
    password: null,
    ft_login: undefined
  }

  let action:string = '';

  let code: number = null

  function success2FA() {
    code = null
    alert('Success ! Welcome !')
    logged.set('true')
    push('/')
  }

  function failure2FA() {
    code = null
    alert('Error')
    logged.set('false')
  }

  async function validate2FA() {
    try {
      const response = await axios.post('http://localhost:3000/auth/2FA/login', { token: code }, { withCredentials: true })
      return response.data === true ? success2FA() : failure2FA()
    } catch (e) {
      console.log(e)
    }
  }

  async function login() {

    if (createUserDto.username === null || createUserDto.password === null)
      return alert('error')

    try {
      const response = await axios.post('/auth/login', createUserDto)
      console.log('response', response)
      if (response.data === 'jwt2fa') {
        action = 'qrcode';
      } else {
        alert('Success ! Welcome !')
        createUserDto.username = null
        createUserDto.password = null
        logged.set('true')
        push('/')
      }
    } catch (e) {
      console.log(e)
      alert(e.response.data.message)
      createUserDto.username = null
      createUserDto.password = null
    }
  }

  async function signup() {

    if (createUserDto.username === null || createUserDto.password === null)
      return alert('error')

    try {
      await axios.post('/auth/signup', createUserDto)
      alert('Signup success. Now you can login.')
      createUserDto.username = null
      createUserDto.password = null
      action = '';
    } catch (e) {
      alert(e.response.data.message)
      createUserDto.username = null
      createUserDto.password = null
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
      <button on:click={ () => (action = 'signup')}>
        <div class="connect-button">
          signup
        </div>
      </button>
      <button on:click={() => (action = 'signin')}>
        <div class="connect-button">
          signin
        </div>
      </button>
    </div>

  {:else if action === 'signup'}
    <div class="action">
      <input type="text" placeholder="username" bind:value={createUserDto.username}><br>
      <input type="text" placeholder="password" bind:value={createUserDto.password}><br>
      <button on:click={signup}>signup</button>
      <button on:click={ () => (action = '')}>return</button>
    </div>

  {:else if action === 'signin'}
    <div class="action">
      <input type="text" placeholder="username" bind:value={createUserDto.username}><br>
      <input type="text" placeholder="password" bind:value={createUserDto.password}><br>
      <button on:click={login}>login</button>
      <button on:click={ () => (action = '')}>return</button>
    </div>

  {:else if action === 'qrcode'}
    <div class="action">
      <input type="text" inputmode="numeric" bind:value={code}>
      <button on:click={validate2FA}>2FA Validate</button>
      <button on:click={ () => (action = '')}>return</button>
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