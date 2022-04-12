import { normalize, join } from 'path';

export default {
  listenPort: process.env.API_PORT || '5000',
  ipfsUrl: process.env.IPFS_URL || 'http://image-uploader-ipfs-node:5001/api/v0',
  testingIpfsUrl: 'http://image-uploader-ipfs-node-test:5001/api/v0',
  projectDir: normalize(join(__dirname, '..')),
  swagger: {
    title: 'Unique image uploader API',
    version: '1',
    description: ''
  },
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'text/json', 'application/json']
}