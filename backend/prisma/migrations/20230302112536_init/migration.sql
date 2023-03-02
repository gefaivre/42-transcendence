-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "winnerId" INTEGER NOT NULL,
    "winnerScore" INTEGER NOT NULL,
    "loserId" INTEGER NOT NULL,
    "loserScore" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "ranked" BOOLEAN NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_loserId_fkey" FOREIGN KEY ("loserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
