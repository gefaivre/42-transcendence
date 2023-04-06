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
import UserProfile from './routes/UserProfile.svelte';
import CreateChannel from './routes/CreateChannel.svelte';
import Chan from './routes/Chan.svelte';

export default {
    '/': Home,
    '/signup': Signup,
    '/login': Login,
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
    '/:username': UserProfile,
    '/message/create': CreateChannel,
    '/message/:name': Chan,
    '*': NotFound
};
