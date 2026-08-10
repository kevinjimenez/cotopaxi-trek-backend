// npm i dotenv joi
import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  NODE_ENV: string;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  PAGINATION_LIMIT: number;
  PAGINATION_MAX: number;
  PAGINATION_PAGE: number;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    NODE_ENV: joi.string().default('local'),
    DATABASE_URL: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    JWT_EXPIRES_IN: joi.string().required(),
    PAGINATION_LIMIT: joi.number().required(),
    PAGINATION_MAX: joi.number().required(),
    PAGINATION_PAGE: joi.number().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate({
  ...process.env,
}) as {
  error?: joi.ValidationError;
  value: EnvVars;
};

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars = value;

export const envs = {
  port: envVars.PORT,
  nodeEnv: envVars.NODE_ENV,
  databaseUrl: envVars.DATABASE_URL,
  jwtSecret: envVars.JWT_SECRET,
  jwtExpiresIn: envVars.JWT_EXPIRES_IN,
  paginationLimit: envVars.PAGINATION_LIMIT,
  paginationMax: envVars.PAGINATION_MAX,
  paginationPage: envVars.PAGINATION_PAGE,
};
