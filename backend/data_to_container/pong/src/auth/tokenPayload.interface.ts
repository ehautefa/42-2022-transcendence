interface TokenPayload {
  userUuid: string;
  isTwoFactorAuthenticated?: boolean;
}

export default TokenPayload;