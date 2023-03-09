import NotFound from './routes/NotFound.svelte'
import Home from './routes/Home.svelte'
import Chat from './routes/chat/Chat.svelte'
import UserCRUD from './routes/UserCRUD.svelte'
import Leaderboard from './routes/Leaderboard.svelte'
import Users from './routes/Users.svelte'

export default {
    '/': Home,
    '/chat': Chat,
    '/UserCRUD': UserCRUD,
    '/leaderboard': Leaderboard,
    '/users/:name': Users,
    '*': NotFound
};
