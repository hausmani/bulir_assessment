export default () => ({
  ports: {
    main: parseInt(process.env.PORT || '3000'),
  },
  database: {
    main: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    },
  },
  
  jwt: {
    expiry: parseInt(process.env.JWT_EXPIRY || '3600'),
    secret: process.env.JWT_SECRET,
  },
  seed: {
    user: {
      firstName: process.env.USER_FIRSTNAME,
      lastName: process.env.USER_LASTNAME,
      email: process.env.USER_EMAIL,
      password: process.env.USER_PASSWORD,
      role: process.env.USER_ROLE,
    },
    admin: {
      firstName: process.env.ADMIN_FIRSTNAME,
      lastName: process.env.ADMIN_LASTNAME,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: process.env.ADMIN_ROLE,
    },
  },
  
});
