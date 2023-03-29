<script>
    import Layout from "./Layout.svelte";
    import axios from "axios";
    import { onMount} from "svelte";
  
    let user = null;
    let username = window.location.hash.substr(2);
  
    const getUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/users/${username}`, {
          withCredentials: true
        });
        user = response.data;
        console.log(user);
      } catch (error) {
        console.log("error getting user");
        // ici tu peux rediriger vers la page notfound en changeant la valeur de la variable username
        username = 'notfound';
      }
    }
  
    const str = 'path/' + username;
  
    onMount(() => {
      // ajoute un écouteur d'événement pour "popstate"
      window.addEventListener('popstate', async () => {
        username = window.location.hash.substr(2);
        await getUser();
      });
    });
    getUser();
    //ajouter la page 404 notfound directement?
  </script>
  <Layout>
      
      <div class="content">
          
          {#if user}
          <h1>Profil de {username}</h1>
          {:else}
          <p>404 page not found</p>
          {/if}
        </div>
    </Layout>
        
    <style>
        .content {
          width: 400px;
          height: 500px;
          background-color: aliceblue;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
       </style>
  