import { Injectable } from '@nestjs/common';
import { Message } from './class/Message';

@Injectable()
export class ChatService {

  messages: Message[] = [{username:'testuser', text: 'dummy message'}];
  

  createMessage(message: Message) {
    this.messages.push(message);
  }

  getMessages() {
    return this.messages;
  }
}
