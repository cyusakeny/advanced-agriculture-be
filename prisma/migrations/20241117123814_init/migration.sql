-- CreateEnum
CREATE TYPE "ProgressStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('RESEARCH', 'AGRICULTURE', 'BUSSINESS');

-- CreateEnum
CREATE TYPE "ReactionStatus" AS ENUM ('ACCEPTED', 'REJECTED', 'PENDING');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agreements" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "bider_status" "ReactionStatus" NOT NULL,
    "owner_status" "ReactionStatus" NOT NULL,
    "status" TEXT NOT NULL,
    "project_owner_id" INTEGER NOT NULL,
    "bid_submitter_id" INTEGER NOT NULL,
    "project_id" INTEGER NOT NULL,

    CONSTRAINT "agreements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agreement_points" (
    "id" SERIAL NOT NULL,
    "description" TEXT,
    "owner_status" "ReactionStatus" NOT NULL,
    "bider_status" "ReactionStatus" NOT NULL,
    "agreement_id" INTEGER NOT NULL,

    CONSTRAINT "agreement_points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "milestones" INTEGER NOT NULL,
    "milestones_achieved" INTEGER NOT NULL DEFAULT 0,
    "type" "ProjectType" NOT NULL,
    "status" "ProgressStatus" NOT NULL,
    "owner_id" INTEGER NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "milestones" (
    "id" SERIAL NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "status" "ProgressStatus" NOT NULL,
    "project_id" INTEGER NOT NULL,

    CONSTRAINT "milestones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "agreements_project_owner_id_idx" ON "agreements"("project_owner_id");

-- CreateIndex
CREATE INDEX "agreements_bid_submitter_id_idx" ON "agreements"("bid_submitter_id");

-- CreateIndex
CREATE INDEX "agreements_project_id_idx" ON "agreements"("project_id");

-- CreateIndex
CREATE INDEX "agreement_points_agreement_id_idx" ON "agreement_points"("agreement_id");

-- CreateIndex
CREATE INDEX "projects_owner_id_idx" ON "projects"("owner_id");

-- CreateIndex
CREATE INDEX "milestones_project_id_idx" ON "milestones"("project_id");

-- AddForeignKey
ALTER TABLE "agreements" ADD CONSTRAINT "agreements_project_owner_id_fkey" FOREIGN KEY ("project_owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agreements" ADD CONSTRAINT "agreements_bid_submitter_id_fkey" FOREIGN KEY ("bid_submitter_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agreements" ADD CONSTRAINT "agreements_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agreement_points" ADD CONSTRAINT "agreement_points_agreement_id_fkey" FOREIGN KEY ("agreement_id") REFERENCES "agreements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestones" ADD CONSTRAINT "milestones_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
