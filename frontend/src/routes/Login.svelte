<script lang="ts">

  import axios from "axios";
  import { push } from "svelte-spa-router";
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

    if (createUserDto.username == null || createUserDto.password == null)
      return alert('error')

    try {
      await axios.post('http://localhost:3000/auth/login', createUserDto, { withCredentials: true })
      alert('Success ! Welcome !')
      createUserDto.username = null
      createUserDto.password = null
      logged.set('true')
      push('/')
    } catch (error) {
      alert(error.response.data.message)
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