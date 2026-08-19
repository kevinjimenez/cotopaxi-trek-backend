import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import { envs } from '../../common/config/envs';
import { PrismaClient } from '../generated/prisma/client';
import { RoleType } from '../generated/prisma/enums';

const adapter = new PrismaPg({ connectionString: envs.databaseUrl });
const prisma = new PrismaClient({ adapter });

const hash = (plain: string) => bcrypt.hashSync(plain, 10);

async function clear() {
  console.log('Borrando data existente...');

  // Orden importante: hijos primero, padres después (respetando las FKs).
  await prisma.booking.deleteMany();
  await prisma.userSeason.deleteMany();
  await prisma.seasonMountain.deleteMany();
  await prisma.userCredential.deleteMany();
  await prisma.user.deleteMany();
  await prisma.season.deleteMany();
  await prisma.mountain.deleteMany();
  await prisma.company.deleteMany();
}

async function main() {
  await clear();

  console.log('Seeding...');

  const company = await prisma.company.upsert({
    where: { slug: 'cotopaxi-trek' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Cotopaxi Trek',
      slug: 'cotopaxi-trek',
      whatsapp: '+593999999999',
      status: true,
    },
  });

  const superadmin = await prisma.user.upsert({
    where: {
      companyId_username: { companyId: company.id, username: 'superadmin' },
    },
    update: {},
    create: {
      companyId: company.id,
      name: 'Super',
      lastname: 'Admin',
      username: 'superadmin',
      email: 'superadmin@cotopaxitrek.com',
      phone: '+593990000001',
      role: RoleType.superadmin,
    },
  });

  await prisma.userCredential.upsert({
    where: { userId: superadmin.id },
    update: {},
    create: { userId: superadmin.id, password: hash('Superadmin123!') },
  });

  console.log('Seed completo:');
  console.log({
    company: company.slug,
    users: {
      superadmin: 'superadmin / Superadmin123!',
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
