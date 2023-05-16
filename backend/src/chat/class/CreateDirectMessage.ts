import { DirectMessage } from "@prisma/client"

export class CreateDirectMessage implements Omit<DirectMessage, 'id'> {
  content: string
  senderId: number
  receiverId: number
}