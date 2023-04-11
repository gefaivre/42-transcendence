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
    <div class="prompt">
        <form>
            <label for="chat" class="sr-only">Your message</label>
            <textarea id="chat" rows="1" class="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your message..."></textarea>
            <button type="submit" class="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-white">
              <svg aria-hidden="true" class="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
              <span class="sr-only">Send message</span>
            </button>
          </form> 
    </div>

</Layout>
{:else}
    <p>404 channel not found</p>
{/if}

<style>
    .Wall{
        height: calc(100% - 156px);
        width: calc(100% - 448px);
        position: absolute;
        left: 448px;
        top: 56px;
            }
    .prompt{
        position: absolute;
        width: calc(100% - 448px);
        height: 100px;
        bottom: 0px;
        left: 448px;

    }
    .prompt form {
  display: flex;
  justify-content: space-between;
}
.prompt button[type="submit"] {
  width: 100px;
}
.prompt button svg {
  width: 40px;
  height: 40px;
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