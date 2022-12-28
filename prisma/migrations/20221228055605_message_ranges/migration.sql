/*
  Warnings:

  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[link]` on the table `blacklisted_links` will be added. If there are existing duplicate values, this will fail.

*/
-- DropTable
DROP TABLE "Message";

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_contents" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_states" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "message_states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "threads" (
    "id" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "mainMessageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "threads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blacklisted_links_link_key" ON "blacklisted_links"("link");

-- AddForeignKey
ALTER TABLE "message_contents" ADD CONSTRAINT "message_contents_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_states" ADD CONSTRAINT "message_states_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_states" ADD CONSTRAINT "message_states_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "message_contents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_states" ADD CONSTRAINT "message_states_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "threads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "threads" ADD CONSTRAINT "threads_mainMessageId_fkey" FOREIGN KEY ("mainMessageId") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
