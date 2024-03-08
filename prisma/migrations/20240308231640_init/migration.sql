-- CreateTable
CREATE TABLE `tokens` (
    `id` VARCHAR(191) NOT NULL,
    `symbol` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `exchange` VARCHAR(191) NULL,
    `factory` VARCHAR(191) NULL,
    `additional_info` JSON NULL,

    UNIQUE INDEX `tokens_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rank_tokens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token_id` VARCHAR(191) NOT NULL,
    `chain` VARCHAR(191) NOT NULL,
    `exchange` VARCHAR(191) NOT NULL,
    `pair` VARCHAR(191) NOT NULL,
    `rank` INTEGER NOT NULL,
    `side` ENUM('gainer', 'loser') NOT NULL DEFAULT 'gainer',
    `timestamp` DATETIME(3) NULL,
    `price` DOUBLE NULL,
    `price24h` DOUBLE NULL,
    `variation24h` DOUBLE NULL,
    `creationBlock` DOUBLE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `rank_tokens` ADD CONSTRAINT `rank_tokens_token_id_fkey` FOREIGN KEY (`token_id`) REFERENCES `tokens`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
