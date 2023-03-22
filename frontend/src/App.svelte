<script lang="ts">
    import Router from 'svelte-spa-router'
    import routes from './routes'

</script>

<main>
    <Router {routes}/>
</main>

<style>

/*
   :global(main, h1) {
    	text-align: center;
    }
    :global(table, td) {
        border: 1px solid #000000;
        min-width: 70px;
        text-align: center;
        margin: auto;
    }
    :global(thead) {
        background-color: #333;
        color: #fff;
    }
    :global(fieldset) {
        text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
    }
    :global(legend) {
        background-color: #000;
        color: #fff;
        padding: 3px 6px;
    }*/

</style>