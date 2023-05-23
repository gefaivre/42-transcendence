export type User = {
  id: number
  username: string
  password: string
  mmr: number
  games: number
  ft_login: string
  friends: { id: number, username: string }[]
  friendOf: { id: number, username: string }[]
  pendingFriends: { id: number, username: string }[]
  requestFriends: { id: number, username: string }[]
  TwoFA: boolean
}

// mirrors prisma
export enum ChannelStatus {
  Public = "Public",
  Private = "Private",
  Protected = "Protected",
}

export type Channel = {
  id: number
  name: string
  ownerId: number
  owner: User
  users: User[]
  admins: User[]
  posts: PostEmitDto[]
  status: ChannelStatus
}

export type ChannelBis = Channel & {
  joined: boolean
}

// mirrors backend
export type ChannelDto = {
  channelName: string
  status: ChannelStatus
  password: string
}

// mirrors backend
export type PostEmitDto = {
  channelName: string
  content: string
  author: string
}
export type newPostEmitDto = {
  channelName: string
  content: string
  author: User
  date: Date
}
// mirros the object backend sends with `throw new WsException()`
export type WsException = {
  status: string
  message: string
}

// mirrors backend
export type ChatResponse = {
  event: string
  data: string
}

export type DirectMessage = {
  content: string
  sender: string
  recipient: string
}
