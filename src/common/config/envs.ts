// npm i dotenv joi
import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  NODE_ENV: string;
  DATABASE_URL: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    NODE_ENV: joi.string().default('local'),
    DATABASE_URL: joi.string().required(),
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
};
