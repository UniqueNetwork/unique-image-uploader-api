import { normalize, join } from 'path';

export default {
  listenPort: process.env.API_PORT || '5000',
  ipfsUrl: process.env.IPFS_URL || 'http://offchain-ipfs-node:5001/api/v0',
  testingIpfsUrl: 'http://offchain-test-ipfs-node:5001/api/v0',
  projectDir: normalize(join(__dirname, '..')),
  swagger: {
    title: 'Unique offchain API',
    version: '1',
    description: ''
  },
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
}