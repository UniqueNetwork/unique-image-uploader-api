import { ApiPromise, WsProvider } from '@polkadot/api';

describe('Polkadot api', () => {
  jest.setTimeout(60 * 1000);

  it('Opal connection test', async () => {
    const wsProvider = new WsProvider('wss://ws-opal.unique.network');
    const api = await ApiPromise.create({ provider: wsProvider });
    await api.isReady
    const collection = JSON.parse(JSON.stringify(await api.query.nft.collectionById(1)));

    await expect(collection.owner).toBe('5GR75aMsKBmux3L87Tt9aNqut9QpvXduNkHaagtYGkFtiVux');

    await api.disconnect();
  });
});
