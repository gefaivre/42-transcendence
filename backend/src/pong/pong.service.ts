import { Injectable } from '@nestjs/common';
import { Message } from './class/Message';
import { Socket } from 'socket.io';

@Injectable()
export class PongService {
  clients: Socket[] = [];

  startGame(client: Socket) {
    this.clients.push(client);
    if (this.clients.length === 2)
      return true;
    else
      return false;
  }

}
