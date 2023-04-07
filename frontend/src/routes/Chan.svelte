<script>
    import Layout from "./Layout.svelte";
    import axios from "axios";
    import { onMount} from "svelte";
    import ChanMenu from "./chanLayouts.svelte";
    import settingsImage from "../assets/settings.png"
  
    let chan = null;
    let chanName = window.location.hash.substr(10);
  
    const getChan = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/channel/${chanName}`, {
          withCredentials: true
        });
        chan = response.data;
        console.log(chan);
      } catch (error) {
        console.log("error getting user");
        //chanName = 'notfound';
      }
    }
  
    onMount(() => {
      // ajoute un écouteur d'événement pour "popstate"
      window.addEventListener('popstate', async () => {
        chanName = window.location.hash.substr(10);
        await getChan();
      });
    });
    getChan();
  </script>
{#if chan}
<Layout>
    <ChanMenu>
    </ChanMenu>
    <div class="horizontalBar">
        <h1>{chan.name}</h1>
        <div class="settings">
            <img src={settingsImage} alt="settings whell">
        </div>

    </div>
    <div class="Wall">
    </div>

</Layout>
{:else}
    <p>404 channel not found</p>
{/if}

<style>
    .Wall{
        height: calc(100% - 56px);
        width: calc(100% - 448px);
        position: absolute;
        left: 448px;
        top: 56px;
        background-color: white;
            }
    .horizontalBar{
        height: 56px;
        width: calc(100% - 448px);
        position: absolute;
        left: 448px;
        top: 0px;
        background-color: goldenrod;
    }
    .horizontalBar .settings{
        position: absolute;
        right : 5%;
        top :5%;
        height: 50px;
        width: 50px;
    }

    h1{
        position: absolute;
        left : 2%;
        top: 20%;
        color : #9E27D9;
        font-size: 25px;
    }
    .settings img{
        position: absolute;
        width: 100%;
        height: 100%;
    }
</style>