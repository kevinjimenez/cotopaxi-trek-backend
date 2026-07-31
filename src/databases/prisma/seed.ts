import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { envs } from '../../common/config/envs';
import { PrismaClient } from '../generated/prisma/client';
import { RoleType } from '../generated/prisma/enums';

const adapter = new PrismaPg({ connectionString: envs.databaseUrl });
const prisma = new PrismaClient({ adapter });

const hash = (plain: string) => bcrypt.hashSync(plain, 10);

async function main() {
  console.log('Seeding...');

  const company = await prisma.company.upsert({
    where: { slug: 'cotopaxi-trek' },
    update: {},
    create: {
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
      role: RoleType.superadmin,
    },
  });

  await prisma.userCredential.upsert({
    where: { userId: superadmin.id },
    update: {},
    create: { userId: superadmin.id, password: hash('Superadmin123!') },
  });

  const admin = await prisma.user.upsert({
    where: { companyId_username: { companyId: company.id, username: 'admin' } },
    update: {},
    create: {
      companyId: company.id,
      name: 'Kevin',
      lastname: 'Zambrano',
      username: 'admin',
      email: 'admin@cotopaxitrek.com',
      role: RoleType.admin,
    },
  });

  await prisma.userCredential.upsert({
    where: { userId: admin.id },
    update: {},
    create: { userId: admin.id, password: hash('Admin123!') },
  });

  const customer = await prisma.user.upsert({
    where: {
      companyId_username: { companyId: company.id, username: 'jperez' },
    },
    update: {},
    create: {
      companyId: company.id,
      name: 'Juan',
      lastname: 'Pérez',
      username: 'jperez',
      email: 'jperez@example.com',
      role: RoleType.customer,
    },
  });

  await prisma.userCredential.upsert({
    where: { userId: customer.id },
    update: {},
    create: { userId: customer.id, password: hash('Cliente123!') },
  });

  const season = await prisma.season.upsert({
    where: {
      companyId_year_name: {
        companyId: company.id,
        year: 2026,
        name: 'Temporada Alta',
      },
    },
    update: {},
    create: {
      companyId: company.id,
      name: 'Temporada Alta',
      year: 2026,
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-06-30'),
      isCurrent: true,
    },
  });

  const cotopaxi = await prisma.mountain.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      companyId: company.id,
      name: 'Cotopaxi',
      altitudeMeters: 5897.5,
      location: 'Provincia de Cotopaxi, Ecuador',
      latitude: -0.68582,
      longitude: -78.438128,
      status: true,
    },
  });

  const chimborazo = await prisma.mountain.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      companyId: company.id,
      name: 'Chimborazo',
      altitudeMeters: 6263.47,
      location: 'Provincia de Chimborazo, Ecuador',
      latitude: -1.469444,
      longitude: -78.817778,
      status: true,
    },
  });

  const seasonMountainCotopaxi = await prisma.seasonMountain.upsert({
    where: {
      seasonId_mountainId: { seasonId: season.id, mountainId: cotopaxi.id },
    },
    update: {},
    create: {
      seasonId: season.id,
      mountainId: cotopaxi.id,
      sortOrder: 1,
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-06-30'),
      price: 350.0,
    },
  });

  await prisma.seasonMountain.upsert({
    where: {
      seasonId_mountainId: { seasonId: season.id, mountainId: chimborazo.id },
    },
    update: {},
    create: {
      seasonId: season.id,
      mountainId: chimborazo.id,
      sortOrder: 2,
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-06-30'),
      price: 420.5,
    },
  });

  await prisma.userSeason.upsert({
    where: { userId_seasonId: { userId: customer.id, seasonId: season.id } },
    update: {},
    create: { userId: customer.id, seasonId: season.id },
  });

  await prisma.booking.upsert({
    where: {
      userId_seasonMountainId: {
        userId: customer.id,
        seasonMountainId: seasonMountainCotopaxi.id,
      },
    },
    update: {},
    create: {
      userId: customer.id,
      seasonMountainId: seasonMountainCotopaxi.id,
      createdBy: admin.id,
    },
  });

  console.log('Seed completo:');
  console.log({
    company: company.slug,
    users: {
      superadmin: 'superadmin / Superadmin123!',
      admin: 'admin / Admin123!',
      customer: 'jperez / Cliente123!',
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
