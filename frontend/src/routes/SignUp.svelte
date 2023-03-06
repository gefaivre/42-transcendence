<script lang="ts">

    type User = {
        username: string
        password: string
    };

    async function signin(event: any) {

        //console.log(event);
        //console.log(event.target);
        //console.log(event.target.username.value);
        //console.log(event.target.password.value);

        let user: User = {
            username: event.target.username.value as string,
            password: event.target.password.value as string
        }

        const response = await fetch('http://localhost:3000/auth/signin', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })

        //console.log(response.status)
        //console.log(response.body)

    }

</script>

<main>

  <!-- TODO (?) use bind:value -->
  <form on:submit|preventDefault={signin}>
      <input required type="text" id="username" placeholder="username"/>
      <input required type="password" id="password" placeholder="password"/>
      <button type="submit">Create account</button>
  </form>

  <br>
  <br>

  <a href={FT_AUTHORIZE}>Signup with 42</a>

</main>


<style>
    form {
      text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
    }
</style>
