<script lang="ts">

  import axios from "../axios.config";
  import { push, replace } from "svelte-spa-router";
  import { logged } from "../stores";

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

  async function login() {

    if (createUserDto.username === null || createUserDto.password === null)
      return alert('error')

    try {
      const response = await axios.post('/auth/login', createUserDto)
      console.log('response', response)
      if (response.data === 'jwt2fa') {
        replace('/2FA')
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

</script>

<br>
<br>
<br>

<input type="text" placeholder="username" bind:value={createUserDto.username}><br>
<input type="text" placeholder="password" bind:value={createUserDto.password}><br>
<button on:click={login}>login</button>

<style>

input:focus::placeholder {
    color: transparent;
}

</style>