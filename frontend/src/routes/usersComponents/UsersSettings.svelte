<script lang="ts">
    import axios from "axios";
	import {id , user} from "../../stores";
    import { replace } from "svelte-spa-router";


	let username: string = null
	let password: string = null

	async function updateUsername() {

		// guards
		if (username == null) { return alert('empty username') }
		if (username == $user.username) { return alert('same username') }

		try {
			// Yes, this body is dirty.
			await axios.patch(`http://localhost:3000/users/username/${$user.username}`, {
				id: $id,
				username: username
			}, {
				withCredentials: true
			})
			alert('Username successfully updated!')
			// update component state
			$user.username = username
			username = null

			// redirect to your new user page
			replace(`/users/${$user.username}`)
		} catch (error) {
		alert(error.response.data.message)
		}

	}

	// before update, password displayed in table is the hash
	// after update, password displayed in table is in clear
	// you'll need to refresh the page to see the new password in its hashed version
	// this is not big deal since this table entry will be removed anyway
	async function updatePassword() {
		// guards
		if (password == null) { return alert('empty password') }
		try {
			// Yes, this body is dirty.
			await axios.patch(`http://localhost:3000/users/password/${$user.username}`, {
				id: $id,
				password: password
			}, {
				withCredentials: true
			})

			alert('Password successfully updated!')

			// update component state
			$user.password = password
			password = null

			// redirect to your new user page
			replace(`/users/${$user.username}`)
		} catch (error) {
		alert(error.response.data.message)
		}
	}

</script>


<h1>Settings</h1>

<style>

		h1 {
				color: var(--white);
		}

</style>