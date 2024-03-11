/*
  Warnings:

  - You are about to alter the column `token_id` on the `rank_tokens` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `tokens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `tokens` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - Added the required column `address` to the `tokens` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `rank_tokens` DROP FOREIGN KEY `rank_tokens_token_id_fkey`;

-- DropIndex
DROP INDEX `tokens_id_key` ON `tokens`;

-- AlterTable
ALTER TABLE `rank_tokens` MODIFY `token_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `tokens` DROP PRIMARY KEY,
    ADD COLUMN `address` VARCHAR(191) NOT NULL,
    ADD COLUMN `image` VARCHAR(191) NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `rank_tokens` ADD CONSTRAINT `rank_tokens_token_id_fkey` FOREIGN KEY (`token_id`) REFERENCES `tokens`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
