/*
  Warnings:

  - You are about to alter the column `blurHash` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - Made the column `blurHash` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `profileImageURL` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "blurHash" SET NOT NULL,
ALTER COLUMN "blurHash" SET DEFAULT E'URLXY;xu~q%M~qofRjj[RjfQIUWB?bj[WBj[',
ALTER COLUMN "blurHash" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "profileImageURL" SET NOT NULL,
ALTER COLUMN "profileImageURL" SET DEFAULT E'https://gdyzsghhuucelkwpprwa.supabase.co/storage/v1/object/public/images/users/avatar.jpg';
