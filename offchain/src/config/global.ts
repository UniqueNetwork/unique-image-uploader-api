export default {
  listenPort: process.env.API_PORT || '5000',
  uploadsDir: process.env.UPLOADS_DIR || '/tmp',
  postgresUrl: process.env.POSTGRES_URL || 'postgres://offchain:12345@offchain-postgres:5432/offchain',
  swagger: {
    title: 'Unique offchain API',
    version: '1',
    description: ''
  },
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
}