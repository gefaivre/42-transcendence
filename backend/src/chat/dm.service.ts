import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateDirectMessage } from "./types/CreateDirectMessage";

@Injectable()
export class DirectMessageService {

  constructor(private readonly prisma: PrismaService) {}

  create(message: CreateDirectMessage) {
    return this.prisma.directMessage.create({
      data: {
        content: message.content,
        senderId: message.senderId, // P2023
        receiverId: message.receiverId // P2023
      }
    })
  }

  async findAllMesagesBetweenTwoUsers(id: number, _id: number) {
    const messages = await this.prisma.directMessage.findMany({
      where: {
        OR: [
          {
            senderId: id,
            receiverId: _id
          },
          {
            senderId: _id,
            receiverId: id
          }
        ]
      },
      select: {
        content: true,
        sender: {
          select: {
            username: true
          }
        },
        receiver: {
          select: {
            username: true
          }
        }
      }
    })
    return (messages.map(message => ({
      content: message.content,
      sender: message.sender.username,
      reveiver: message.receiver.username
    })))
  }

  async findAllDirectMessagePenpalsById(userId: number) {

    console.log(await this.prisma.directMessage.findMany({}))

    console.log(await this.prisma.directMessage.groupBy({
      by: ['senderId', 'receiverId']
    }))

    console.log(await this.prisma.directMessage.findMany({
      distinct: ['senderId', 'receiverId']
    }))

    console.log(await this.prisma.directMessage.findMany({
      distinct: ['senderId', 'receiverId'],
      select: {
        sender: {
          select: {
            username: true
          }
        },
        receiver: {
          select: {
            username: true
          }
        }
      }
    }))

    return

    console.log(await this.prisma.directMessage.groupBy({
      by: ['senderId', 'receiverId'],
      where: {
        OR: [
          {
            senderId: userId
          },
          {
            receiverId: userId
          }
        ]
      }
    }))

    // select only chats where `userId` is involved
    const chats = await this.prisma.directMessage.groupBy({
      by: ['senderId', 'receiverId'],
      where: {
        OR: [
          {
            senderId: userId
          },
          {
            receiverId: userId
          }
        ]
      }
    })

    // get an array of all the ids for those chats
    const b = chats.flatMap(({ senderId, receiverId }) => [senderId, receiverId])
    console.log(b)

    // remove all the `id` values
    const c = b.filter(val => val !== userId)
    console.log(c)

    // remove duplicates
    const d = Array.from(new Set(c))
    console.log(d)

    // now we got all the user ids with which `id` as been in contact
    return d
  }

}