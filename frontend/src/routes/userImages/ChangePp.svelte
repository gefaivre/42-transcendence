
<script lang="ts">
    import axios from '../../axios.config';

    let fileInput: any = null

    let ImageParameter: boolean = false

    let imagesTab = []

    export let reloadImage


    async function submitImage() {
        console.log(fileInput.files[0])

        if (fileInput.files[0] === null || fileInput.files[0] === undefined)
          return alert('empty file')


        const file = fileInput.files[0]
        const formData = new FormData()
        formData.append('file', file)

        try {
            const response = await axios.post('/images/add', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        });
        reloadImage++
        } catch (e) {
        console.error(e)
        }
    };

    async function toggleImageParameter() {
      ImageParameter = !ImageParameter
    }

    async function downloadImages() {
      axios.get('/images/all')
      .then(res => {
        imagesTab = res.data;
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
            reloadImage++
        })
        .catch(err => {
            console.log(err)
        })

    }

</script>
    <br>
    <button on:click={toggleImageParameter} on:click|once={downloadImages} type="button">Change pp</button>
    {#if ImageParameter}
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
    {/if}


<style>

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

