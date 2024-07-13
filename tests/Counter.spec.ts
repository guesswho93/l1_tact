import { Blockchain, printTransactionFees, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { beginCell, toNano } from '@ton/core';
import { Counter, storeOpResultMessage } from '../wrappers/Counter';
import '@ton/test-utils';

describe('Counter', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let counter: SandboxContract<Counter>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');

        counter = blockchain.openContract(await Counter.fromInit(deployer.address));


        const deployResult = await counter.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            null
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: counter.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        let res = await counter.send(deployer.getSender(), {value: toNano("0.05")}, {$$type: "AddMessage", vars: {$$type: "BinaryOp", a: 2n, b: 5n}})
        printTransactionFees(res.transactions)
        expect(res.transactions).toHaveTransaction({
            from: counter.address,
            to: deployer.address,
            body: beginCell().store(storeOpResultMessage({$$type: "OpResultMessage", res: 9n})).endCell()
        });
        expect(await counter.getAdd(2n, 5n)).toEqual(9n);
    });

    it('should subtract', async () => {
        let res = await counter.send(deployer.getSender(), { value: toNano("0.05") }, { $$type: "SubMessage", vars: { $$type: "BinaryOp", a: 10n, b: 3n } });
        expect(res.transactions).toHaveTransaction({
            from: counter.address,
            to: deployer.address,
            body: beginCell().store(storeOpResultMessage({ $$type: "OpResultMessage", res: 7n })).endCell()
        });
        expect(await counter.getSub(10n, 3n)).toEqual(7n);
    });

    it('should multiply', async () => {
        let res = await counter.send(deployer.getSender(), { value: toNano("0.05") }, { $$type: "MulMessage", vars: { $$type: "BinaryOp", a: 3n, b: 4n } });
        expect(res.transactions).toHaveTransaction({
            from: counter.address,
            to: deployer.address,
            body: beginCell().store(storeOpResultMessage({ $$type: "OpResultMessage", res: 12n })).endCell()
        });
        expect(await counter.getMul(3n, 4n)).toEqual(12n);
    });

    it('should divide', async () => {
        let res = await counter.send(deployer.getSender(), { value: toNano("0.05") }, { $$type: "DivMessage", vars: { $$type: "BinaryOp", a: 10n, b: 2n } });
        printTransactionFees(res.transactions);
        expect(res.transactions).toHaveTransaction({
            from: counter.address,
            to: deployer.address,
            body: beginCell().store(storeOpResultMessage({ $$type: "OpResultMessage", res: 5n })).endCell()
        });
        expect(await counter.getDiv(10n, 2n)).toEqual(5n);
    });

    it('should mod', async () => {
        let res = await counter.send(deployer.getSender(), { value: toNano("0.05") }, { $$type: "ModMessage", vars: { $$type: "BinaryOp", a: 10n, b: 3n }});
        printTransactionFees(res.transactions);

        expect(res.transactions).toHaveTransaction({
            from: counter.address,
            to: deployer.address,
            body: beginCell().store(storeOpResultMessage({ $$type: "OpResultMessage", res: 1n })).endCell()
        });
        expect(await counter.getMod(10n, 3n)).toEqual(1n);
    });

    it('should power', async () => {
        let res = await counter.send(deployer.getSender(), { value: toNano("0.05") }, { $$type: "PowMessage", a: 2n, b: 3n });
        printTransactionFees(res.transactions);
        expect(res.transactions).toHaveTransaction({
            from: counter.address,
            to: deployer.address,
            body: beginCell().store(storeOpResultMessage({ $$type: "OpResultMessage", res: 8n })).endCell()
        });
        expect(await counter.getPow(2n, 3n)).toEqual(8n);
    });
});
