<script lang="ts">

    import greenWin from '../assets/greenWin.png';
    import redLose from "../assets/redLose.png";
    import ChangePp from "./usersComponents/ChangePp.svelte";
    import { user } from "../stores";


    let changePp: Boolean = false;

    let reloadImage:number;

    let game = [];
    let toggleValue = 1;
    let avatar, fileinput;


</script>



    {#if $user}

    <div class="rectangle">
        <h1 class="text-5xl font-extrabold text-pink-500 text-center">Profil</h1>
            {#if user}
                <img class="ftbigAvatar rounded-full w-100 h-100" src='http://localhost:3000/images/actual/{$user.id}' alt="Rounded avatar">
            {/if}
        <div class="uploadAvatar">
           <button on:click={() => (changePp = !changePp)} class="changePp">ChangePp</button>
        </div>
        {#if user}
        <div class="username">
            <div class="text-4xl text-white text-center font-inter">{$user.username}</div>
        </div>
        <div class="togleFa">
            <label class="relative inline-flex mr-5 cursor-pointer">
                <div class="relative inline-block w-11 h-6 dark:bg-gray-700">
                    <input type="checkbox" class="peer hidden dark:checked:bg-purple-600" bind:checked={toggleValue} on:change={toggle}/>
                    <div class="absolute inset-0 rounded-full bg-gray-200 peer-checked:bg-purple-600 peer-checked:peer-focus:ring-4 peer-checked:peer-focus:ring-purple-300 dark:peer-checked:peer-focus:ring-purple-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600">
                    </div>
                </div>


                <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300" style="color: #CDCDCD;">2FA (2 factor authentification)</span>
              </label>
        </div>
        {/if}
    </div>

    {#if !changePp}
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
    {#if $user}
    <div class="mmr">
        <span style="position: relative; color: #CDCDCD; font-size: 32px; font-family: Arial; top: 50%">Elo points : {$user.mmr}</span>
    </div>
    <div class="statistics">
            <h1 class="text-4xl font-inter" style="color: #9E27D9;">Statistics</h1>
            <div class="victory">
                <img src={greenWin} alt="victory">
                <div class="text">
                    <span style="color: white; font-size: 20px; position: relative; top:30%; font-family: Arial;">Won games</span>
                </div>
                <div class="displaynb">
                    <span style="color: white; font-size: 20px; position: relative; top:30%; font-family: Arial;">{$user.wins.length}</span>
                </div>

            </div>
            <div class="loses">
                <img src={redLose} alt="loose">
                <div class="text">
                    <span style="color: white; font-size: 20px; position: relative; top:30%; font-family: Arial;">Lost games</span>
                </div>
                <div class="displaynb">
                    <span style="color: white; font-size: 20px; position: relative; top:30%; font-family: Arial;">{$user.loses.length}</span>

                </div>

            </div>
            <div class="ratio">
                <div class="text">
                    <span style="color: white; font-size: 20px; position: relative; top:30%; font-family: Arial;">Ratio</span>
                </div>
                <div class="displaynb">
                    <span style="color: white; font-size: 20px; position: relative; top:30%; font-family: Arial;">{$user.wins.length/$user.loses.length}</span>
                </div>
            </div>


    </div>
    {/if}
    {:else}
    <!-- Inlude component dosen't work, tailwindcss issue -->
        <p>COOUCOU</p>
        <ChangePp bind:reloadImage={reloadImage} />
    {/if}
    {/if}

<style>
    .rectangle {
    position: fixed;
    top: 0;
    left: 88px;
    width: 360px;
    height: 100%;
    background-color: black;
    z-index: 1;
    border-right: 1px solid #707070;
    border-left: 1px solid #707070;

    }
    .ftbigAvatar{
        position: absolute;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 200px;
        height: 200px;

    }
    .ftbigAvatar img{
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
    .gameHistory {
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
    .rectangle .togleFa{
        position: absolute;
        bottom: 5%;
        height: 60px;
        width: 80%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .rectangle .uploadAvatar{
        position: absolute;
        bottom: 40%;
        height: 35px;
        width: 50%;
        left: 50%;
        transform: translate(-50%, 0%);
        cursor: pointer;

    }

</style>