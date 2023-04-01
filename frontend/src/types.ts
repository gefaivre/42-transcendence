export type User = {
    id: number
    username: string
    password: string
    mmr: number
    games: number
    ft_login: string
}

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
    users: []
    admins: []
    status: ChannelStatus
}

export type ChannelDto = {
    channelName: string
    status: ChannelStatus
    password: string
}