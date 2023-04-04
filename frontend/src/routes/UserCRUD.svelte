<script lang="ts">
    import AddUser from "./userCRUD/AddUser.svelte";
    import DeleteAllUser from "./userCRUD/DeleteAllUser.svelte";
    import DeleteUser from "./userCRUD/DeleteUser.svelte";
    import GetAllUser from "./userCRUD/GetAllUser.svelte";
    import GetUser from "./userCRUD/GetUser.svelte";
    import UpdateUser from "./userCRUD/UpdateUser.svelte";
    import { logged } from "../stores";

</script>

{#if $logged === 'true'}
    <h1>--UserCRUD--</h1>
    <AddUser></AddUser>
    <GetAllUser></GetAllUser>
    <GetUser></GetUser>
    <UpdateUser></UpdateUser>
    <DeleteUser></DeleteUser>
    <DeleteAllUser></DeleteAllUser>
{:else}
    <h1>UNAUTHORIZED ACCESS</h1>
{/if}
