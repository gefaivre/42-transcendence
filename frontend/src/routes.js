import NotFound from './routes/NotFound.svelte'
import Home from './routes/Home.svelte'
import PageTest from './routes/PageTest.svelte'

export default {
    '/': Home,
    '/test': PageTest,
    '*': NotFound
};
