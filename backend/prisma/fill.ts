import { PrismaClient, User } from '@prisma/client'

const n = 5
let tab: User[];
const prisma = new PrismaClient()


function randomUsername(): string {
		let result = '-t-';
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
		const numbers = '0123456789';
		let usernameSize = Math.floor(Math.random() * (10 - 1) + 1);
		for(let i:number = 0; i < usernameSize; i++) {
			result += characters.charAt(Math.floor(Math.random() * characters.length));
		}
		for(let i:number = 0; i < 2; i++) {
			result += numbers.charAt(Math.floor(Math.random() * numbers.length));
		}
		return result;
  }

function randomString(): string {
  return Math.random().toString(36).slice(2).substring(0,7)
}

function randomNumber(): number {
  return Math.floor(Math.random() * (150 - 0) + 0)
}

function createpending(user: User) {
  prisma.user.update({
    where: {
      id: user.id
    },
    data: {
      pendingFriends: {
        connect: { id: user.id }
      }
    }
  })
}


function createRequest(user: User) {

}

function createFriends(user: User) {

}


async function main() {
  // User creation
  for (let i = 0; i < n; i++) {
    let user: User;
    try {
      user = await prisma.user.create({
        data: {
          username: randomUsername(),
          password: '',
          games: randomNumber(),
          mmr: randomNumber(),
					images: {
						create: {
              name: "default",
              link: "/app/images/basic_pp.jpg",
            }
					}
        }
      })
      tab.push(user)
    } catch (error) {
    }
  }
  //Connecct friends
  for (let i = 0; i < tab.length - 1; i + 2) {

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