import NotFound from './routes/NotFound.svelte'
import Chat from './routes/chat/Chat.svelte'
import Leaderboard from './routes/Leaderboard.svelte'
import Users from './routes/Users.svelte'
import Message from './routes/Message.svelte'
import Test from './routes/test.svelte'
import Channels from './routes/Channels.svelte'
import CreateChannel from './routes/CreateChannel.svelte';
import Chan from './routes/OneChan.svelte'
import ThomasChan from './routes/Chan.svelte'
import Pong from './routes/pong/Pong.svelte'
import DirectMessage from './routes/DirectMessage.svelte'

export default {
  '/': Leaderboard,
  '/chat/:type?/:name?': Chat,
  '/channel/:name': ThomasChan,
  '/Channels': Channels,
  '/leaderboard': Leaderboard,
  '/users/:name': Users, 
  '/message': Message,
  '/test': Test,
  '/message/create': CreateChannel,
  '/message/:name': Chan,
  '/pong': Pong,
  '/dm/:username': DirectMessage,
  '*': NotFound
};
