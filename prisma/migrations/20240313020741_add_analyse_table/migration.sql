-- CreateTable
CREATE TABLE `wallet_analyzer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `wallet_address` VARCHAR(191) NOT NULL,
    `status` ENUM('ACTIVE', 'COMPLETE', 'ERROR') NOT NULL DEFAULT 'ACTIVE',
    `time_period` INTEGER NOT NULL,
    `transactions` JSON NULL,
    `historical_prices` JSON NULL,
    `result` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
