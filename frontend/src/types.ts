export type User = {
  id: number
  username: string
  password: string
  mmr: number
  games: number
  ft_login: string
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
  admins: []
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