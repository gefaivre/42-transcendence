<script lang="ts">

    import axios from 'axios'

    type User = {
        username: string;
        password: string;
       };
    
    let user : User = {};


    function signUp() {
        console.log('user ' + user.username + ' sign up')
        axios.post('http://localhost:3000/user', user)
            .then((res) => {
                console.log(res)
            })
            .catch((err) => {
                console.log(err)
            });
    };

   </script>

<form on:submit|preventDefault={signUp}>
    <input type="text" bind:value={user.username} placeholder="enter a username"><br>
    <input type='password' bind:value={user.password} placeholder="enter password"><br>

    <button type="submit">submit</button>
</form>

<style>
    form {
        text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
        }
</style>
