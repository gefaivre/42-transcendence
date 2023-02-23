import NotFound from './routes/NotFound.svelte'
import Home from './routes/Home.svelte'
import Chat from './routes/chat/Chat.svelte'

export default {
    '/': Home,
    '/chat': Chat,
    '*': NotFound
};
