<script lang="ts">
    import axios from "axios";
	import {id , user, reloadImage} from "../../stores";
    import { replace } from "svelte-spa-router";
    import { onMount } from "svelte";


    let fileInput: any = null

    let imagesTab = []

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
        downloadImages();
        $reloadImage++
        } catch (error) {
        console.error(error)
        }
        fileInput == null;
    };

    async function downloadImages() {
      axios.get('http://localhost:3000/images/all', { withCredentials: true })
      .then(res => {
        imagesTab = res.data;
        downloadImages();
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
            $reloadImage++
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


  <div class="settings-container">

    <h1 class="title">Settings</h1>

    <div class="box-info image">
      <h1>Change your pp</h1>
      <div class="image-list">
        {#each imagesTab as i}
        <button class="hidden-button"  on:click={() => { UpdatePP(i.id) }}>
          <img class="pp" src="http://localhost:3000/images/{i.id}" alt="{i.name}">
        </button>
        {/each}
          <form class="form" on:change|preventDefault={submitImage}>
            <label for="file-upload" >Add Image</label>
            <input bind:this={fileInput} type="file" style="visibility: hidden;" id="file-upload"/>
          </form>
      </div>
    </div>

    <div class="box-info username">
      <h1>change your username</h1>
      <div class="content">
        <input type="text" placeholder="new username" bind:value={username}>
        <button on:click={updateUsername}>Update</button>
      </div>
    </div>

    <div class="box-info twofa">
      <h1>Toggle 2fa</h1>
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
    font-family: 'Courier New', Courier, monospace;
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

  .image{
    grid-column: 1 / 2;
    grid-row: 2 / 4 ;
    min-width: 140px;
    width: 80%;
    height: 80%;
    place-self: center;
    overflow: hidden;
  }

  .username {
    grid-row: 2 / 3;
    grid-column: 2 / 3;
    place-self: center;
    min-width: 250px;
    width: 50%;
    height: 20%;

  }

  .twofa {
    grid-row: 3 / 4;
    grid-column: 2 / 3;
    place-self: center;
    width: 20%;
    height: 20%;

  }

.image-list {
    padding-left: 2%;
    padding-right: 2%;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content:space-around;
    margin: auto;
    width: 100%;
    height: 100%;
    padding-bottom: 20px;
    overflow-y: scroll;
}

.image-list .pp{
    width: 100px;
    height: 100px;
    object-fit: cover;
    margin: auto;
    cursor: pointer;
}

.form{
    width: 100px;
    height: 100px;
    border: solid 2px var(--black);
    pointer-events: none;
}

.form label {
  width: 100%;
  height: 100%;
  pointer-events: all;
}

.image-list .pp:hover {
    -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
    -moz-box-sizing: border-box;    /* Firefox, other Gecko */
    box-sizing: border-box;         /* Opera/IE 8+ */
    border: 2px solid #333;
}

.hidden-button {
  border: none;
  outline: none;
  box-shadow: none;
}


.username .content{
  margin-top:  5%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

.username .content input {
  border-radius: 10px;
}

</style>