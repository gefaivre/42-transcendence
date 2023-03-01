/*
  Warnings:

  - A unique constraint covering the columns `[games]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `games` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "games" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_games_key" ON "User"("games");
