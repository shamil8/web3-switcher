# Web3 switcher - change provider automatically


Multichain Web3-switcher class for your contracts and blockchain methods.

You can use it with your `sequelize` orm, also you can add some networks or providers.

Example init web3-switcher in your app:
```typescript
await switcherDatabase('postgres://root:root@localhost:5432/example');

/** Example init providers. You can add your providers. */
try {
    await createDbProvider({ isTestNet: true, });
}
catch (e) {
    console.log('Error, add node provider to db');
}
```


Example multi get web3 instances.
```typescript
import Web3 from 'web3-switcher/lib/Web3';

const web3Ins: {[network: string]: Web3, } = {};

export default function getWeb3(net: string): Web3 {
    if (!web3Ins[net]) {
        web3Ins[net] = new Web3(net, {
            envProvider: wsProviders[net],
            parseLimit: parseLimits[net],
        }, 'your wallet (metamask) key');
    }

    return web3Ins[net];
}
```
