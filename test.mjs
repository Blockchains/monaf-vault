import './vault-lib.js'; import assert from 'node:assert/strict';
const MV = globalThis.MV; const V = MV.VAULT;
const runbook = {
  sendWeth: '0xa9059cbb000000000000000000000000760fab1796480368fed4084ae1a01491577a21800000000000000000000000000000000000000000000000000022d10c4ecc8000',
  activate: '0xacec338a0000000000000000000000000000000000000000000000000000000000000001',
  pause: '0x16c38b3c0000000000000000000000000000000000000000000000000000000000000001',
  unpause: '0x16c38b3c0000000000000000000000000000000000000000000000000000000000000000',
  withdrawAll: '0x958e2d3100000000000000000000000000000000000000000000000000000000f4865700' };
const f = MV.tx.fundVault('1100'), w = MV.tx.sendWeth('0.0098'), k = MV.tx.fundKeeper('20'), a = MV.tx.activate(), p = MV.tx.pause(), u = MV.tx.unpause(), x = MV.tx.withdrawAll();
assert.equal(f.to, V); assert.equal(BigInt(f.value), 1100n * 10n ** 18n); assert.equal(f.data, '0x');
assert.equal(w.to, MV.WETH); assert.equal(w.value, '0x0'); assert.equal(w.data, runbook.sendWeth);
assert.equal(k.to, MV.KEEPER); assert.equal(BigInt(k.value), 20n * 10n ** 18n);
for (const [t, n] of [[a, 'activate'], [p, 'pause'], [u, 'unpause'], [x, 'withdrawAll']]) { assert.equal(t.to, V); assert.equal(t.data, runbook[n]); }
assert.equal(BigInt(x.gas), 800000n);
assert.equal(MV.toWei('0.0098'), 9800000000000000n); assert.throws(() => MV.toWei('-1')); assert.throws(() => MV.toWei('0')); assert.throws(() => MV.toWei('1e3'));
assert.ok(MV.isOwner('0x9A4382E8C662B827cf38A1f18cb5fa07ce61Ac1F')); assert.ok(!MV.isOwner('0x85c2bBcf6d7419740d01a60874BD3F85B2c96Fe2'));
for (const v of ['0x8f', '0x8F', '143', ' 143 ', 143, 143n]) assert.equal(MV.parseChainId(v), 143, String(v));
assert.equal(MV.parseChainId('0x143'), 323); assert.ok(Number.isNaN(MV.parseChainId('abc'))); assert.ok(Number.isNaN(MV.parseChainId(undefined)));
console.log('CHAINID OK');
console.log('ALL CALLDATA MATCHES RUNBOOK');
