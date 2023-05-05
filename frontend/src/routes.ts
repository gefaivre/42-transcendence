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
import Signup from './routes/Signup.svelte'
import Login from './routes/Login.svelte'
import Pong from './routes/pong/Pong.svelte'
import TwoFA from './routes/2FA.svelte'
import ThomasChan from './routes/Chan.svelte'
import createChan from './routes/CreateChannel.svelte'
import Chan from './routes/OneChan.svelte'
import test from './routes/test.svelte'

export default {
    '/': Home,
    '/signup': Signup,
    '/login': Login,
    '/chat': Chat,
    '/channel/:name': ThomasChan,
    '/UserCRUD': UserCRUD,
    '/Channels': Channels,
    '/leaderboard': Leaderboard,
    '/users/:name': Users,
    '/Menu': Menu,
    '/profil': Profil,
    '/channel': Channel,
    '/message': Message,
    '/message/create': createChan,
    '/message/:name': Chan,
    '/game': Game,
    '/2FA': TwoFA,
    '/pong': Pong,
    '/test': test,
    '*': NotFound
};
