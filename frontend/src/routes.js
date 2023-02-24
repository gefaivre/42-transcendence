import NotFound from './routes/NotFound.svelte'
import Home from './routes/Home.svelte'
import PageTest from './routes/PageTest.svelte'
import Pong from './routes/pong/Pong.svelte'

export default {
    '/': Home,
    '/test': PageTest,
    '/pong': Pong,
    '*': NotFound,
};
