import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, SubscribeMessage, WebSocketServer, ConnectedSocket, MessageBody } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { UserStatus, Status } from 'src/types';

@WebSocketGateway({
  path: '/user',
  cors: {
    origin: `${process.env.COMMON_BASE_URL}:8080`,
    credentials: true
  },
})
export class UsersGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server

  status: UserStatus[] = []

  @SubscribeMessage('getOnlineStatus')
  getOnlineStatus(@ConnectedSocket() client: Socket, @MessageBody() username: string) {
    const user: UserStatus | undefined = this.status.find(user => user.username === username)
    return user === undefined ? Status.offline : user.status
  }

  @SubscribeMessage('setOnlineStatus')
  setOnlineStatus(@ConnectedSocket() client: Socket, @MessageBody() status: any) {
    const user: UserStatus | undefined = this.status.find(user => client.id === user.socketId)
    if (user !== undefined) {
      user.status = status
    }
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    if (this.status.some(status => status.username === client.handshake.query.username) === false) {
      this.status.push({
        username: client.handshake.query.username as string,
        prismaId: +(client.handshake.query.id as string),
        socketId: client.id,
        lastPing: Date.now(),
        status: Status.online
      })
    }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    const toDelete = this.status.findIndex(status => status.socketId === client.id)
    if (toDelete !== -1)
      this.status.splice(toDelete, 1)
  }

}
