import { PrismaClient } from '@prisma/client'

const n = 42
const prisma = new PrismaClient()

function randomString(): string {
  return Math.random().toString(36).slice(2).substring(0,7)
}

function randomNumber(): number {
  return Math.floor(Math.random() * (150 - 0) + 0)
}

async function main() {
  for (let i = 0; i < n; i++) {
    try {
      await prisma.user.create({
        data: {
          username: randomString(),
          password: null,
          games: randomNumber(),
          mmr: randomNumber()
        }
      })
    } catch (error) {
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
