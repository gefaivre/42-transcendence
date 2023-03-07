import NotFound from './routes/NotFound.svelte'
import Home from './routes/Home.svelte'
import PageTest from './routes/PageTest.svelte'
import UserCRUD from './routes/UserCRUD.svelte'
import Leaderboard from './routes/Leaderboard.svelte'
import SignUp from './routes/SignUp.svelte'
import Profile from './routes/Profile.svelte'

export default {
    '/': Home,
    '/test': PageTest,
    '/UserCRUD': UserCRUD,
    '/leaderboard': Leaderboard,
    '/signup': SignUp,
    '/profile': Profile,
    '*': NotFound
};
