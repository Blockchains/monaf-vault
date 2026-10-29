// monaf vault control: pure helpers (no keys, no network). Loaded by index.html; also testable in node.
(function (g) {
  const VAULT = '0x760Fab1796480368Fed4084ae1a01491577A2180';
  const OWNER = '0x9a4382e8c662b827cf38a1f18cb5fa07ce61ac1f';
  const KEEPER = '0x85c2bBcf6d7419740d01a60874BD3F85B2c96Fe2';
  const WETH = '0xEE8c0E9f1BFFb4Eb878d8f15f368A02a35481242';
  const CHAIN_ID = 143, CHAIN_HEX = '0x8f', DEADLINE = 4102444800n, WITHDRAW_GAS = '0xc3500'; // 800,000
  const SEL = { owner: '0x8da5cb5b', active: '0x02fb0c5e', paused: '0x5c975abb', openCount: '0xcfaf380e', keeper: '0xaced1661',
    balanceOf: '0x70a08231', transfer: '0xa9059cbb', setActive: '0xacec338a', setPaused: '0x16c38b3c', withdrawAll: '0x958e2d31' };
  const word = (n) => BigInt(n).toString(16).padStart(64, '0');
  const addrWord = (a) => { if (!/^0x[0-9a-fA-F]{40}$/.test(a)) throw new Error('bad address'); return a.slice(2).toLowerCase().padStart(64, '0'); };
  function toWei(str) { // exact decimal -> wei (18 dp), no floats
    const s = String(str).trim(); if (!/^\d+(\.\d{0,18})?$/.test(s) && !/^\.\d{1,18}$/.test(s)) throw new Error('bad amount: ' + s);
    const [i, f = ''] = s.split('.'); const w = BigInt(i || '0') * 10n ** 18n + BigInt((f + '0'.repeat(18)).slice(0, 18));
    if (w <= 0n) throw new Error('amount must be > 0'); return w;
  }
  function fmt(wei, dp = 4) { const w = BigInt(wei), i = w / 10n ** 18n, f = (w % 10n ** 18n).toString().padStart(18, '0').slice(0, dp); return `${i.toLocaleString('en-US')}.${f}`; }
  const hex = (n) => '0x' + BigInt(n).toString(16);
  const tx = {
    fundVault: (amt) => ({ to: VAULT, value: hex(toWei(amt)), data: '0x' }),
    sendWeth: (amt) => ({ to: WETH, value: '0x0', data: SEL.transfer + addrWord(VAULT) + word(toWei(amt)) }),
    fundKeeper: (amt) => ({ to: KEEPER, value: hex(toWei(amt)), data: '0x' }),
    activate: () => ({ to: VAULT, value: '0x0', data: SEL.setActive + word(1) }),
    pause: () => ({ to: VAULT, value: '0x0', data: SEL.setPaused + word(1) }),
    unpause: () => ({ to: VAULT, value: '0x0', data: SEL.setPaused + word(0) }),
    withdrawAll: () => ({ to: VAULT, value: '0x0', data: SEL.withdrawAll + word(DEADLINE), gas: WITHDRAW_GAS }),
  };
  const isOwner = (a) => typeof a === 'string' && a.toLowerCase() === OWNER;
  g.MV = { VAULT, OWNER, KEEPER, WETH, CHAIN_ID, CHAIN_HEX, SEL, word, addrWord, toWei, fmt, hex, tx, isOwner };
})(typeof window !== 'undefined' ? window : globalThis);
