import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { CommonModule } from './common/common.module';
import { DatabasesModule } from './databases/databases.module';
import { HealthModule } from './health/health.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { UserCredentialsModule } from './user-credentials/user-credentials.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gpl'),
      sortSchema: true,
    }),
    ConfigModule.forRoot(),
    HealthModule,
    CommonModule,
    DatabasesModule,
    UsersModule,
    UserCredentialsModule,
  ],
})
export class AppModule {}
