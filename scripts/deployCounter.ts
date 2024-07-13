import { toNano } from '@ton/core';
import { Counter } from '../wrappers/Counter';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const counter = provider.open(await Counter.fromInit(provider.sender().address!!));

    await counter.send(
        provider.sender(),
        {
            value: toNano('0.02'),
        },
        // {
        //     $$type: "ProxyMessage",
        //     to: Address.parse("0QD0Kb75ucoRsCKY-tBhzgxPW6ciokURybJtrwIkVN55p8K2"),
        //     body: "Hello from the 1st tact lesson"
        // }
        null
    );

     await provider.waitForDeploy(counter.address);

    // run methods on `counter`
}
