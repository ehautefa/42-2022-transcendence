
export const JwtConfig = {
  secret: process.env.JWT_ACCESS_TOKEN_SECRET,
  signOptions: {
    expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}s`
  }
}
