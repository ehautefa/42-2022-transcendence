import * as Joi from 'joi';

export const Config = {
      validationSchema: Joi.object({
        PGPORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        FT_CLIENT_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        REACT_APP_FRONT_URL: Joi.string().required(),
      }),
  }
