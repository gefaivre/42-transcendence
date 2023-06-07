<script lang="ts">

  import Images from "./user-settings/Images.svelte";
  import Username from "./user-settings/Username.svelte";
  import Password from "./user-settings/Password.svelte";
  import Twofa from "./user-settings/Twofa.svelte";

</script>

<div class="settings-container">

  <h1 class="title">Settings</h1>

  <Images />

  <Username />

  <Twofa />

  <Password />

</div>

<style>

  .settings-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 125px 1fr 1fr;
    background-color: var(--grey);
    height: 100%;
  }

  .title {
    grid-column: 1 / 3;
    grid-row: 1 / 2;
    font-size: 50px;
    text-shadow: 0 0 20px;
    font-family: "Courier New", Courier, monospace;
    letter-spacing: 0.5px;
    color: var(--pink);
    margin-top: 40px;
    text-align: center;
  }

  @media screen and (max-width: 1200px) {

    .settings-container {
      grid-template-columns: 1fr ;
      grid-template-rows: 125px 1fr 1fr 1fr 1fr;
      gap: 25px;
    }

    .title {
      grid-column: 1 / 2;
    }

  }

</style>
