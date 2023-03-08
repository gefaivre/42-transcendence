import NotFound from './routes/NotFound.svelte'
import Home from './routes/Home.svelte'
import UserCRUD from './routes/UserCRUD.svelte'
import Leaderboard from './routes/Leaderboard.svelte'
import SignUp from './routes/SignUp.svelte'
import Users from './routes/Users.svelte'
import Connection from './routes/Connection.svelte'

export default {
    '/': Home,
    '/UserCRUD': UserCRUD,
    '/leaderboard': Leaderboard,
    '/signup': SignUp,
    '/connection': Connection,
    '/users/:name': Users,
    '*': NotFound
};
