<script>
    import Layout from "./Layout.svelte";
    import axios from "../axios.config";
    import { onMount} from "svelte";
    import avatar from '../assets/008-utilisateur.png';
    import greenWin from '../assets/greenWin.png';
    import redLose from "../assets/redLose.png";
    import MatchHistory from '../assets/match_history.json';

    let user = null;
    let game = [];
    let username = window.location.hash.substr(2);

    const getUser = async () => {
      try {
        const response = await axios.get(`/users/${username}`);
        user = response.data;
        console.log(user);
        game = MatchHistory;
      } catch (e) {
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
  </script>
  {#if user}
  <Layout>
    <div class="Profil">
        <div class="bigAvatar">
            <img class="rounded-full" src={avatar} alt="Rounded avatar">
        </div>
        <div class="username">
            <div class="text-4xl text-white text-center font-inter">{user.username}</div>
        </div>
    </div>
    <div class="gameHistory">
        <h1 class="text-4xl font-inter" style="color: #9E27D9;">Game History</h1>
        <div class=scrolable style="overflow-y: scroll;">
            {#each game as match}
            <div class="match">
                {#if match.winner.name !== "username"}
                <div class="lilavatar">
                    <img class="rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="Rounded avatar">
                </div>
                <p style="position: relative; top: 0px; color: red; left: 20%; font-size: 23px;">{match.winner.name}</p>
                <img src={redLose} alt="victory">
                {/if}
                {#if match.loser.name !== "username"}
                <div class="lilavatar">
                    <img class="rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="Rounded avatar">
                </div>
                <p style="position: relative; left: 20%; top: 0px;  color: green; font-size: 23px;">{match.loser.name}</p>
                <img src={greenWin} alt="victory">
                {/if}
            </div>
            {/each}

        </div>
    </div>
    <div class="mmr">
        <span style="position: relative; color: #CDCDCD; font-size: 32px; font-family: Arial; top: 50%">Elo points : {user.mmr}</span>
    </div>
    <div class="statistics">
        <h1 class="text-4xl font-inter" style="color: #9E27D9;">Statistics</h1>
        <div class="victory">
            <img src={greenWin} alt="victory">
            <div class="text">
                <span style="color: white; font-size: 20px; position: relative; top:30%; font-family: Arial;">Won games</span>
            </div>
            <div class="displaynb">
                <span style="color: white; font-size: 20px; position: relative; top:30%; font-family: Arial;">{user.wins.length}</span>
            </div>

        </div>
        <div class="loses">
            <img src={redLose} alt="loose">
            <div class="text">
                <span style="color: white; font-size: 20px; position: relative; top:30%; font-family: Arial;">Lost games</span>
            </div>
            <div class="displaynb">
                <span style="color: white; font-size: 20px; position: relative; top:30%; font-family: Arial;">{user.loses.length}</span>

            </div>

        </div>
        <div class="ratio">
            <div class="text">
                <span style="color: white; font-size: 20px; position: relative; top:30%; font-family: Arial;">Ratio</span>
            </div>
            <div class="displaynb">
                <span style="color: white; font-size: 20px; position: relative; top:30%; font-family: Arial;">{user.wins.length/user.loses.length}</span>
            </div>
        </div>
    </div>
    </Layout>
    {:else}
    <Layout>
        <div class="content">
            <span style="color: white; font-size: 50px; position: relative; top:30%; font-family: Arial;">404 page not found</span>

        </div>
    </Layout>
    {/if}

    <style>
        .content {
          width: 600px;
          height: 500px;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
        .Profil{
            position: fixed;
            top: 0;
            left: 88px;
            width: 360px;
            height: 100%;
            z-index: 1;
            border-right: 1px solid #707070;
            border-left: 1px solid #707070;
        }
        .bigAvatar{
            position: absolute;
            top: 40%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 200px;
            height: 200px;
        }
        .bigAvatar img{
            position: absolute;
            width: 100%;
            height: 100%;
        }
        .username{
            position: absolute;
            top: 75%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            height: 50px;
        }
        .gameHistory{
            position: fixed;
            top: 180px;
            left: 525px;
            width: 25%;
            height: 70%;
            z-index: 1;
            border-right: 1px solid #707070;
            border-left: 1px solid #707070;
            border-top: 1px solid #707070;
            border-bottom: 1px solid #707070;
            border-radius: 5%;
        }
    .gameHistory h1{
            margin-left: 20px;
            margin-top: 20px;
            margin-bottom: 30px;
        }
        .scrolable{
        position: relative;
        height: 80%;
    }
    .gameHistory .scrolable .match {
         margin-bottom: 10px;
         height: 35px;
    }
    .gameHistory .scrolable .match img{
        position: relative;
        border: 2px solid purple; /**pour visualiser avent changement d'image*/
        height: 100%;
        width: 35px;
        top: -35px;
        left: 70%;

     }
     .gameHistory .scrolable .match .lilavatar  {
        position: relative;
        width: 35px;
        height: 35px;
        float: left;
        left:15%;
        margin-right: 0px;
    }
    .gameHistory .scrolable .match .lilavatar img{
        position: relative;
        top:0px;
        left: 0%;
        height: 100%;
        width: 100%;
    }
    .mmr{
        position: absolute;
        top : 30%;
        right: 160px;
        height: 100px;
        width: 250px;
    }
    .statistics{
        position: fixed;
       /* display: flex;
        flex-direction: column;
        */
        bottom: 152px;
        right: 100px;
        width: 412px;
        height: 225px;
        border: 1px solid #707070;
        border-radius: 30px;
        opacity: 1;
        z-index: 1;
    }
    .statistics h1{
        margin-left: 15%;
        margin-top: 20px;
    }
    .statistics .victory{
        position: absolute;
        top: 38%;
        width: 100%;
        height: 20%;
    }
    .statistics .loses{
        position: absolute;
        top: 58%;
        width: 100%;
        height: 20%;
    }
    .statistics .ratio{
        position: absolute;
        top: 78%;
        width: 100%;
        height: 22%;
    }
    .statistics img{
        position: relative;
        border: 2px solid purple; /**pour visualiser avent changement d'image*/
        height: 30px;
        width: 30px;
        top: 30%;
        left: 20%;
    }
    .statistics .text{
        position: absolute;
        left:37%;
        top:0px;
        z-index: 1;
        height: 100%;
        width: 35%;
    }
    .displaynb{
        position: absolute;
        left:80%;
        top:0px;
        z-index: 1;
        height: 100%;
        width: 20%;
    }
    </style>
