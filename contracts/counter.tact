import "@stdlib/ownable";

struct BinaryOp {
    a: Int as uint32;
    b: Int as int32;
}
message AddMessage {
    vars: BinaryOp;
}

message DivMessage {
    vars: BinaryOp;
}

message SubMessage {
    vars: BinaryOp;
}

message MulMessage {
    vars: BinaryOp;
}

message ModMessage {
    vars: BinaryOp;
}

message PowMessage {
    a: Int as uint32;
    b: Int as uint8;
}

message ProxyMessage {
    to: Address;
    body: String;
}

message OpResultMessage {
    res: Int;
}

trait Calculator {
    counter: Int;

    get fun add(a: Int, b: Int): Int {
        return a + b + a;
    }

        get fun sub(a: Int, b: Int): Int {
        return a - b;
    }

    get fun mul(a: Int, b: Int): Int {
        return a * b;
    }

    get fun div(a: Int, b: Int): Int {
        require(b > 0, "b should be greater than 0");
        return a / b;
    }

    get fun mod(a: Int, b: Int): Int {
        require(b > 0, "b should be greater than 0");
        return a % b;
    }

     get fun pow(a: Int, b: Int): Int {
        let res: Int = 1;
        let base: Int = a;
        let exponent: Int = b;

        while (exponent > 0) {
            if (exponent % 2 == 1) {
                res *= base;
            }
            base *= base;
            exponent /= 2;
        }

        return res;
    }


    receive(msg: AddMessage) {
        send(SendParameters{
            to: sender(),
            value: 0,
            mode: SendRemainingValue,
            body: OpResultMessage{res: self.add(msg.vars.a, msg.vars.b)}.toCell()
        });
    }

        receive(msg: SubMessage) {
        send(SendParameters{
            to: sender(),
            value: 0,
            mode: SendRemainingValue,
            body: OpResultMessage{res: self.sub(msg.vars.a, msg.vars.b)}.toCell()
        });
    }

    receive(msg: MulMessage) {
        send(SendParameters{
            to: sender(),
            value: 0,
            mode: SendRemainingValue,
            body: OpResultMessage{res: self.mul(msg.vars.a, msg.vars.b)}.toCell()
        });
    }

    receive(msg: DivMessage) {
        require(msg.vars.b > 0, "b should be greater than 0");
        self.reply(OpResultMessage{res: msg.vars.a / msg.vars.b}.toCell());
    }

    receive(msg: ModMessage) {
        let res: Int = 0;
        if (msg.vars.b <= 1) {
        res = msg.vars.a;
        } else {
        res = msg.vars.a % msg.vars.b;
        }
        self.reply(OpResultMessage{res}.toCell());
    }

    receive(msg: PowMessage) {
    let res: Int = 1;
    let base: Int = msg.a;
    let exp: Int = msg.b;

    while (exp > 0) {
        if (exp % 2 == 1) {
            res *= base;
        }
        base *= base;
        exp /= 2;
    }

    self.reply(OpResultMessage{res}.toCell());
}
}

contract Counter with Ownable, Calculator {
    owner: Address;
    counter: Int = 0;
    init(owner: Address) {
        self.owner = owner;
    }
    receive() {}
    receive(msg: ProxyMessage) {
        self.requireOwner();
        send(SendParameters{
            to: msg.to,
            value: 0,
            mode: SendRemainingValue,
            body: msg.body.asComment()
        });
        self.counter += 1;
    }
    receive("hello") {
    }

    get fun counter(): Int {
        return self.counter;
    }
    get fun getAdd(a: Int, b: Int): Int {
        return self.add(a, b);
    }

    get fun getSub(a: Int, b: Int): Int {
        return self.add(a, b);
    }

    get fun getMul(a: Int, b: Int): Int {
        return self.add(a, b);
    }

    get fun getDiv(a: Int, b: Int): Int {
        return self.div(a, b);
    }

    get fun getMod(a: Int, b: Int): Int {
        return self.mod(a, b);
    }

    get fun getPow(a: Int, b: Int): Int {
        return self.pow(a, b);
    }
}
