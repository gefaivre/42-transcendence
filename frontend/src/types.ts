export type User = {
    username: string
    password: string
    mmr: number
    games: number
}

export type Channel = {
    id: number
    name: string
    ownerId: number
    owner: User
    users: []
    admins: []
}