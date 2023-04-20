<script lang="ts">
    import axios from "axios";
	import {id , user} from "../../stores";
    import { replace } from "svelte-spa-router";
    import { onMount } from "svelte";


    let fileInput: any = null

    let ImageParameter: boolean = false

    let imagesTab = []

    export let reloadImage

		onMount(() => downloadImages())

    async function submitImage() {
        console.log(fileInput.files[0])

        if (fileInput.files[0] == null) { return alert('empty file') }


        const file = fileInput.files[0]
        const formData = new FormData()
        formData.append('file', file)

        try {
            const response = await axios.post('http://localhost:3000/images/add', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
        });
        reloadImage++
        } catch (error) {
        console.error(error)
        }
        fileInput == null;
    };

    async function toggleImageParameter() {
      ImageParameter = !ImageParameter
    }

    async function downloadImages() {
      axios.get('http://localhost:3000/images/all', { withCredentials: true })
      .then(res => {
        imagesTab = res.data;
      })
      .catch(err => {
        console.log(err)
      })
    }

    async function UpdatePP(id:number) {
        console.log("Update PP")
        await axios.get(`http://localhost:3000/images/set/${id}`, { withCredentials: true })
        .then(res => {
            console.log(res.data)
            reloadImage++
        })
        .catch(err => {
            console.log(err)
        })

    }

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

	<div class="settingsContainer">
		<h1>TESTTSTST</h1>
		<div class="image-list">
			{#each imagesTab as i}
			<button class="hidden-button"  on:click={() => { UpdatePP(i.id) }}>
				<img class="pp" src="http://localhost:3000/images/{i.id}" alt="{i.name}">
			</button>
			{/each}
		</div>
		<form on:submit|preventDefault={submitImage}>
			<input type="file" bind:this={fileInput} accept="image/*">
			<button type="submit">Upload</button>
		</form>
	</div>


<style>


	.settingsContainer {
		height: 100%;
		width: 100%;
		background-color: var(--white);
	}

.image-list {
    border: 2px solid black;
    padding-left: 2%;
    padding-right: 2%;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content:space-between;
    margin: auto;
    width: 100%;
    max-width: 50vw;
    max-height: 270px;
    overflow: auto;
}

.image-list .pp {
    width: 100px;
    height: 100px;
    object-fit: cover;
    margin: auto;
    cursor: pointer;
}

.image-list .pp:hover {
    -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
    -moz-box-sizing: border-box;    /* Firefox, other Gecko */
    box-sizing: border-box;         /* Opera/IE 8+ */
    border: 2px solid #333;
}

.hidden-button {
  border: none;
  background-color: transparent;
  outline: none;
  box-shadow: none;
}

</style>