/*
  Warnings:

  - A unique constraint covering the columns `[customerId]` on the table `Tenant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Tenant_customerId_key" ON "Tenant"("customerId");
