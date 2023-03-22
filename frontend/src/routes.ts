import NotFound from './routes/NotFound.svelte'
import Home from './routes/Home.svelte'
import Chat from './routes/chat/Chat.svelte'
import UserCRUD from './routes/UserCRUD.svelte'
import Leaderboard from './routes/Leaderboard.svelte'
import Users from './routes/Users.svelte'
import Menu from './routes/Menu.svelte'
import Profil from './routes/Profil.svelte'
import Channel from './routes/Channel.svelte'
import Message from './routes/Message.svelte'
import Game from './routes/Game.svelte'
import Test from './routes/test.svelte'
import Channels from './routes/Channels.svelte'

export default {
    '/': Home,
    '/chat': Chat,
    '/UserCRUD': UserCRUD,
    '/Channels': Channels,
    '/leaderboard': Leaderboard,
    '/users/:name': Users,
    '/Menu': Menu,
    '/profil': Profil,
    '/channel': Channel,
    '/message': Message,
    '/game': Game,
    '/test': Test,
    '*': NotFound
};
