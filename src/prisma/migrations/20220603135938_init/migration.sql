-- CreateTable
CREATE TABLE "Article" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "imageURL" VARCHAR(255) NOT NULL,
    "blurHash" TEXT,
    "createdAt" TIMESTAMPTZ(6),
    "updatedAt" TIMESTAMPTZ(6),
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "majority" VARCHAR(255) NOT NULL,
    "entryYear" INTEGER NOT NULL,
    "graduationYear" INTEGER,
    "thesisTitle" VARCHAR(255),
    "thesisURL" VARCHAR(255),
    "blurHash" TEXT,
    "profileImageURL" VARCHAR(255),
    "isAdmin" BOOLEAN DEFAULT false,
    "isGraduated" BOOLEAN DEFAULT false,
    "isVerified" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMPTZ(6),
    "updatedAt" TIMESTAMPTZ(6),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
