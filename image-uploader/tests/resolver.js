// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
const ipfsUtils = `ipfs-core-utils${path.sep}`, ipfsUtilsCjs = `ipfs-core-utils${path.sep}cjs${path.sep}src${path.sep}`;

module.exports = (request, options) => {
  let modulePath;
  try {
    modulePath = options.defaultResolver(request, options);
  }
  catch (e) {
    return;
  }
  if(!modulePath) return;

  if(request.indexOf('ipfs-core-utils') > -1) {
    if(modulePath.indexOf(ipfsUtils) > -1 && !modulePath.endsWith('.js')) return modulePath.split(ipfsUtils).join(ipfsUtilsCjs) + '.js';
  }
  return modulePath;
};