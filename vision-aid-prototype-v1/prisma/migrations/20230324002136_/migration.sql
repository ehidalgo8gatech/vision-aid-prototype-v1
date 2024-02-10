-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `Admin_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Hospital` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,

    UNIQUE INDEX `Hospital_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HospitalRole` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `hospitalId` INTEGER NOT NULL,
    `admin` BOOLEAN NOT NULL,

    UNIQUE INDEX `HospitalRole_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Beneficiary` (
    `mrn` VARCHAR(191) NOT NULL,
    `beneficiaryName` VARCHAR(191) NULL,
    `dateOfBirth` DATETIME(3) NULL,
    `gender` VARCHAR(191) NULL,
    `phoneNumber` VARCHAR(191) NULL,
    `education` VARCHAR(191) NULL,
    `occupation` VARCHAR(191) NULL,
    `districts` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL,
    `diagnosis` VARCHAR(191) NULL,
    `hospitalId` INTEGER NULL,
    `vision` VARCHAR(191) NULL,
    `mDVI` VARCHAR(191) NULL,
    `extraInformation` TEXT NOT NULL,

    UNIQUE INDEX `Beneficiary_mrn_key`(`mrn`),
    PRIMARY KEY (`mrn`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Beneficiary_Mirror` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `beneficiaryNameRequired` BOOLEAN NOT NULL,
    `dateOfBirthRequired` BOOLEAN NOT NULL,
    `genderRequired` BOOLEAN NOT NULL,
    `phoneNumberRequired` BOOLEAN NOT NULL,
    `educationRequired` BOOLEAN NOT NULL,
    `occupationRequired` BOOLEAN NOT NULL,
    `districtsRequired` BOOLEAN NOT NULL,
    `stateRequired` BOOLEAN NOT NULL,
    `diagnosisRequired` BOOLEAN NOT NULL,
    `hospitalIdRequired` BOOLEAN NOT NULL,
    `visionRequired` BOOLEAN NOT NULL,
    `mDVIRequired` VARCHAR(191) NULL,
    `extraInformationRequired` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Computer_Training` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `beneficiaryId` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NULL,
    `sessionNumber` INTEGER NULL,
    `extraInformation` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Computer_Training_Mirror` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` BOOLEAN NOT NULL,
    `sessionNumber` BOOLEAN NOT NULL,
    `extraInformationRequired` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Mobile_Training` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `beneficiaryId` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NULL,
    `sessionNumber` INTEGER NULL,
    `extraInformation` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Mobile_Training_Mirror` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` BOOLEAN NOT NULL,
    `sessionNumber` BOOLEAN NOT NULL,
    `extraInformationRequired` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Orientation_Mobility_Training` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `beneficiaryId` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NULL,
    `sessionNumber` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Orientation_Mobility_Training_Mirror` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` BOOLEAN NOT NULL,
    `sessionNumber` BOOLEAN NOT NULL,
    `extraInformationRequired` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vision_Enhancement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `beneficiaryId` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NULL,
    `sessionNumber` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vision_Enhancement_Mirror` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` BOOLEAN NOT NULL,
    `sessionNumber` BOOLEAN NOT NULL,
    `extraInformationRequired` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Counselling_Education` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `beneficiaryId` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NULL,
    `sessionNumber` INTEGER NULL,
    `typeCounselling` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Counselling_Education_Mirror` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` BOOLEAN NOT NULL,
    `sessionNumber` BOOLEAN NOT NULL,
    `typeCounselling` BOOLEAN NOT NULL,
    `extraInformationRequired` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Camps` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NULL,
    `schoolName` VARCHAR(191) NULL,
    `studentName` VARCHAR(191) NULL,
    `age` INTEGER NULL,
    `gender` VARCHAR(191) NULL,
    `diagnosis` VARCHAR(191) NULL,
    `visualAcuityRE` VARCHAR(191) NULL,
    `visualAcuityLE` VARCHAR(191) NULL,
    `unaidedNearVision` VARCHAR(191) NULL,
    `refractionVALE` VARCHAR(191) NULL,
    `LVA` VARCHAR(191) NULL,
    `LVANear` VARCHAR(191) NULL,
    `nonOpticalAid` VARCHAR(191) NULL,
    `actionNeeded` VARCHAR(191) NULL,
    `hospitalId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `School_Screening` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NULL,
    `typeCamp` VARCHAR(191) NULL,
    `screeningPlace` VARCHAR(191) NULL,
    `organiser` VARCHAR(191) NULL,
    `contactNumber` INTEGER NULL,
    `address` VARCHAR(191) NULL,
    `screenedTotal` INTEGER NULL,
    `refractiveErrors` INTEGER NULL,
    `spectaclesDistributed` INTEGER NULL,
    `checked` VARCHAR(191) NULL,
    `refer` INTEGER NULL,
    `staff` INTEGER NULL,
    `lowVision` INTEGER NULL,
    `hospitalId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
