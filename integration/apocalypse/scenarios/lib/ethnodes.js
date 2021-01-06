const { run, sleep } = require('./utils')

module.exports = {
  connectPeers,
  gethDAGGenerationFinished,
}

function parityAddReservedPeer(node) {
  return fetch('http://localhost:28545', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      method: 'parity_addReservedPeer',
      params: [node],
      id: 1,
      jsonrpc: '2.0',
    }),
  }).then((res) => res.text())
}

async function connectPeers(rpcProvider) {
  const nodes = [
    'enode://8046f1ff008141321e35e27a5ca4f174e28186538d08ee6ad04ea46f909547e28f5ad48ae75528d7d5cad8029a0fb911adcdc8ea36adeb0cc978ccaa0e103f91@172.17.0.4:30303',
    'enode://c1cad3139b0ab583de214e3d64f7fb7793995023559f7fa1e6b01e87603145ca8e60d5d9f8e23d08df3d1c0c82294bd9515b729efec210f060b2fe3a193f9ae0@172.17.0.6:30303',
  ]
  let resp = await parityAddReservedPeer(nodes[0])
  console.log(resp)
  let resp = await parityAddReservedPeer(nodes[1])
  console.log(resp)
}

async function waitForBlock(provider) {
  let block
  while (!block) {
    block = await provider.getBlock(2)
    if (!block) {
      console.debug('no block found so waiting for 5s')
      await sleep(5000)
    }
  }
}

async function gethDAGGenerationFinished(gethProviders) {
  for (let provider of gethProviders) {
    await waitForBlock(provider)
  }
}
