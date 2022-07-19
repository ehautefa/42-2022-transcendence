/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = {
  env: {
	AUTH0_CLIENT_ID:'95976106d24d16c4735c8b3f39334abfb699b1295edc3ecb1b149054e27373b4',
	AUTH0_SECRET:'95bf8c64afd5ea824af816577b37e7d188fa6b98832bf8c1d39253bf686a7467',
	AUTH0_BASE_URL:'https://localhost:3000',
	AUTH0_REDIRECT_URL:'https://localhost:3000/mainPage',
	AUTH0_ISSUER_BASE_URL:'https://api.intra.42.fr/',
	AUTH0_CLIENT_SECRET:'51f8dafe8c264c54ad27e8b0a05170068beb0f67b587043a32ced521724bbb07'
  },
}