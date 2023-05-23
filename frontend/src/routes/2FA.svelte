<script lang="ts">

  import axios from "../axios.config";
  import { push } from "svelte-spa-router";
  import { logged } from "../stores";

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
      const response = await axios.post('/auth/2FA/login', { token: code })
      return response.data === true ? success2FA() : failure2FA()
    } catch (e) {
      console.log(e)
    }
  }

</script>

<br>
<br>
<br>

<input type="text" inputmode="numeric" bind:value={code}>
<button on:click={validate2FA}>2FA Validate</button>