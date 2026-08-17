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

  const admin = await prisma.user.upsert({
    where: { companyId_username: { companyId: company.id, username: 'admin' } },
    update: {},
    create: {
      companyId: company.id,
      name: 'Kevin',
      lastname: 'Zambrano',
      username: 'admin',
      email: 'admin@cotopaxitrek.com',
      phone: '+593990000002',
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
      phone: '+593990000003',
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
      isCurrent: false,
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
      status: false,
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

  const seasonMountainChimborazo = await prisma.seasonMountain.upsert({
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

  await prisma.booking.upsert({
    where: {
      userId_seasonMountainId: {
        userId: customer.id,
        seasonMountainId: seasonMountainChimborazo.id,
      },
    },
    update: {},
    create: {
      userId: customer.id,
      seasonMountainId: seasonMountainChimborazo.id,
      createdBy: admin.id,
    },
  });

  const seasonBaja = await prisma.season.upsert({
    where: {
      companyId_year_name: {
        companyId: company.id,
        year: 2026,
        name: 'Temporada Baja',
      },
    },
    update: {},
    create: {
      companyId: company.id,
      name: 'Temporada Baja',
      year: 2026,
      startDate: new Date('2026-07-01'),
      endDate: new Date('2026-12-31'),
      isCurrent: true,
    },
  });

  const seasonMountainCotopaxiBaja = await prisma.seasonMountain.upsert({
    where: {
      seasonId_mountainId: {
        seasonId: seasonBaja.id,
        mountainId: cotopaxi.id,
      },
    },
    update: {},
    create: {
      seasonId: seasonBaja.id,
      mountainId: cotopaxi.id,
      sortOrder: 1,
      startDate: new Date('2026-07-01'),
      endDate: new Date('2026-12-31'),
      price: 320.0,
    },
  });

  await prisma.seasonMountain.upsert({
    where: {
      seasonId_mountainId: {
        seasonId: seasonBaja.id,
        mountainId: chimborazo.id,
      },
    },
    update: {},
    create: {
      seasonId: seasonBaja.id,
      mountainId: chimborazo.id,
      sortOrder: 2,
      startDate: new Date('2026-07-01'),
      endDate: new Date('2026-12-31'),
      price: 390.0,
    },
  });

  const season2025 = await prisma.season.upsert({
    where: {
      companyId_year_name: {
        companyId: company.id,
        year: 2025,
        name: 'Temporada 2025',
      },
    },
    update: {},
    create: {
      companyId: company.id,
      name: 'Temporada 2025',
      year: 2025,
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-12-31'),
      isCurrent: false,
    },
  });

  await prisma.seasonMountain.upsert({
    where: {
      seasonId_mountainId: {
        seasonId: season2025.id,
        mountainId: cotopaxi.id,
      },
    },
    update: {},
    create: {
      seasonId: season2025.id,
      mountainId: cotopaxi.id,
      sortOrder: 1,
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-12-31'),
      price: 300.0,
    },
  });

  await prisma.seasonMountain.upsert({
    where: {
      seasonId_mountainId: {
        seasonId: season2025.id,
        mountainId: chimborazo.id,
      },
    },
    update: {},
    create: {
      seasonId: season2025.id,
      mountainId: chimborazo.id,
      sortOrder: 2,
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-12-31'),
      price: 360.0,
    },
  });

  const mariana = await prisma.user.upsert({
    where: {
      companyId_username: { companyId: company.id, username: 'mgonzalez' },
    },
    update: {},
    create: {
      companyId: company.id,
      name: 'María',
      lastname: 'González',
      username: 'mgonzalez',
      email: 'mgonzalez@example.com',
      phone: '+593990000004',
      role: RoleType.customer,
    },
  });

  await prisma.userCredential.upsert({
    where: { userId: mariana.id },
    update: {},
    create: { userId: mariana.id, password: hash('Cliente123!') },
  });

  const luis = await prisma.user.upsert({
    where: {
      companyId_username: { companyId: company.id, username: 'lrodriguez' },
    },
    update: {},
    create: {
      companyId: company.id,
      name: 'Luis',
      lastname: 'Rodríguez',
      username: 'lrodriguez',
      email: 'lrodriguez@example.com',
      phone: '+593990000005',
      role: RoleType.customer,
    },
  });

  await prisma.userCredential.upsert({
    where: { userId: luis.id },
    update: {},
    create: { userId: luis.id, password: hash('Cliente123!') },
  });

  await prisma.userSeason.upsert({
    where: { userId_seasonId: { userId: mariana.id, seasonId: season.id } },
    update: {},
    create: { userId: mariana.id, seasonId: season.id },
  });

  await prisma.userSeason.upsert({
    where: { userId_seasonId: { userId: luis.id, seasonId: seasonBaja.id } },
    update: {},
    create: { userId: luis.id, seasonId: seasonBaja.id, enrolled: false },
  });

  const carlos = await prisma.user.upsert({
    where: {
      companyId_username: { companyId: company.id, username: 'ctorres' },
    },
    update: {},
    create: {
      companyId: company.id,
      name: 'Carlos',
      lastname: 'Torres',
      username: 'ctorres',
      email: 'ctorres@example.com',
      phone: '+593990000006',
      role: RoleType.customer,
    },
  });

  await prisma.userCredential.upsert({
    where: { userId: carlos.id },
    update: {},
    create: { userId: carlos.id, password: hash('Cliente123!') },
  });

  // Carlos queda vinculado a más de 2 temporadas, pero solo una (Alta) está activa.
  await prisma.userSeason.upsert({
    where: { userId_seasonId: { userId: carlos.id, seasonId: season.id } },
    update: {},
    create: { userId: carlos.id, seasonId: season.id },
  });

  await prisma.userSeason.upsert({
    where: { userId_seasonId: { userId: carlos.id, seasonId: seasonBaja.id } },
    update: {},
    create: { userId: carlos.id, seasonId: seasonBaja.id, enrolled: false },
  });

  await prisma.userSeason.upsert({
    where: { userId_seasonId: { userId: carlos.id, seasonId: season2025.id } },
    update: {},
    create: { userId: carlos.id, seasonId: season2025.id, enrolled: false },
  });

  await prisma.booking.upsert({
    where: {
      userId_seasonMountainId: {
        userId: mariana.id,
        seasonMountainId: seasonMountainChimborazo.id,
      },
    },
    update: {},
    create: {
      userId: mariana.id,
      seasonMountainId: seasonMountainChimborazo.id,
      createdBy: admin.id,
    },
  });

  await prisma.booking.upsert({
    where: {
      userId_seasonMountainId: {
        userId: luis.id,
        seasonMountainId: seasonMountainCotopaxiBaja.id,
      },
    },
    update: {},
    create: {
      userId: luis.id,
      seasonMountainId: seasonMountainCotopaxiBaja.id,
      createdBy: admin.id,
    },
  });

  const chimboTours = await prisma.company.upsert({
    where: { slug: 'chimbo-tours' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      name: 'Chimbo Tours',
      slug: 'chimbo-tours',
      whatsapp: '+593987654321',
      status: true,
    },
  });

  const andesXtreme = await prisma.company.upsert({
    where: { slug: 'andes-xtreme' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000003',
      name: 'Andes Xtreme',
      slug: 'andes-xtreme',
      whatsapp: '+593976543210',
      status: false,
    },
  });

  const volcanTrek = await prisma.company.upsert({
    where: { slug: 'volcan-trek' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000004',
      name: 'Volcán Trek',
      slug: 'volcan-trek',
      whatsapp: '+593965432109',
      status: true,
    },
  });

  console.log('Seed completo:');
  console.log({
    company: company.slug,
    otherCompanies: [chimboTours.slug, andesXtreme.slug, volcanTrek.slug],
    users: {
      superadmin: 'superadmin / Superadmin123!',
      admin: 'admin / Admin123!',
      customer: 'jperez / Cliente123!',
      customer2: 'mgonzalez / Cliente123!',
      customer3: 'lrodriguez / Cliente123!',
      customer4:
        'ctorres / Cliente123! (vinculado a 3 temporadas, solo Alta activa)',
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
