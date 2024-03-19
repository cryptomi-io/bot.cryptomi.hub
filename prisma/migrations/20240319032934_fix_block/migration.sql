-- DropForeignKey
ALTER TABLE `transactions` DROP FOREIGN KEY `transactions_block_id_fkey`;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_block_id_fkey` FOREIGN KEY (`block_id`) REFERENCES `blocks`(`blockNumber`) ON DELETE RESTRICT ON UPDATE CASCADE;
