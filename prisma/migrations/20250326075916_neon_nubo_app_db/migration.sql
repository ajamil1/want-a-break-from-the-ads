-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "maxAge" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
