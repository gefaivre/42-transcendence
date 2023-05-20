<script lang="ts">
    import axios from "../../axios.config";
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
            const response = await axios.post('/images/add', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
          });
        downloadImages();
        $reloadImage++
        } catch (error) {
        console.error(error)
        }
        fileInput == null;
    };

    async function downloadImages() {
      axios.get('/images/all')
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
        await axios.get(`/images/set/${id}`)
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
			await axios.patch(`/users/username/${$user.username}`, { username: username })

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
			await axios.patch(`/users/password/${$user.username}`, { password: password })

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
          <label for="file-upload" >Add Image
            <input bind:this={fileInput} type="file" style="visibility: hidden;" id="file-upload"/>
          </label>
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
      <img id="qrcode" class="qrcode" src="https://upload.wikimedia.org/wikipedia/commons/7/78/Qrcode_wikipedia_fr_v2clean.png?uselang=fr" alt="qr code">
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
    overflow-y: auto;
    overflow-x: hidden;

  }

  .username {
    grid-row: 2 / 3;
    grid-column: 2 / 3;
    place-self: center;
    width: 250px;
    height: 100px;

  }

  .twofa {
    grid-row: 3 / 4;
    grid-column: 2 / 3;
    place-self: center;
    width: 250px;
    height: 250px;

  }

.image-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    grid-gap: 1em;
    justify-items: center;
}

.image-list .pp{
    width: 100px;
    height: 100px;
    cursor: pointer;
}

form {
  height: 100px;
  width: 100px;
}

label {
  display: inline-block;
  width: 100px;
  height: 100px;
  border: solid 2px var(--black);
  cursor: crosshair;
  background-color: var(--white);
  font-size: 30px;
  text-align: center;
}

.image-list .pp:hover {
    -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
    -moz-box-sizing: border-box;    /* Firefox, other Gecko */
    box-sizing: border-box;         /* Opera/IE 8+ */
    border: 2px solid #333;
}

.hidden-button {
  height: 100px;
  width: 100px;
  border: none;
  outline: none;
  box-shadow: none;
}

.twofa .qrcode {
  display: block;
  height: 200px;
  width: 200px;
  margin: auto;
  filter: blur(10px);
}

.twofa .qrcode:active {
  filter: blur(0px);
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


/* ===== Scrollbar CSS ===== */
  /* Firefox */
  * {
    scrollbar-width: 7px;
    scrollbar-color: var(--pink) ;
  }

  /* Chrome, Edge, and Safari */
  *::-webkit-scrollbar {
    width: 7px;
  }

  *::-webkit-scrollbar-track {
    background: transparent;
  }

  *::-webkit-scrollbar-thumb {
    background-color: var(--pink);
    border-radius: 10px;
  }

</style>