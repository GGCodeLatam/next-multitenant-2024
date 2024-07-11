import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.tenant.createMany({
    data: [
      { name: 'Tenant 1', subdomain: 'tenant1' },
      { name: 'Tenant 2', subdomain: 'tenant2' },
      { name: 'Test', subdomain: 'test' },
    ],
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })