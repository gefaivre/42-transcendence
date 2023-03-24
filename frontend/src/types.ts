export type User = {
    username: string
    password: string
    mmr: number
    games: number
    ft_login: string
}

export type Channel = {
    id: number
    name: string
    ownerId: number
    owner: User
    users: []
    admins: []
}