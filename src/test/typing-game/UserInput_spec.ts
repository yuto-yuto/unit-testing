import "mocha";

import { expect, use } from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";
import readline from "readline";
import { promptUserInput } from "../../lib/typing-game/UserInput";

describe("UserInput", () => {
    before(() => {
        use(chaiAsPromised);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("promptUserInput", () => {
        context("question is default value", () => {
            it("should call question function with empty string", async () => {
                const rl = readline.createInterface(process.stdin);
                const stub = sinon.stub(rl, "question");
                // It triggers a callback when question function is called
                stub.callsFake(() => stub.yield("user input value"));
                sinon.stub(readline, "createInterface").returns(rl);

                await promptUserInput();

                expect(stub.calledWith("", sinon.match.any)).to.be.true;
            });
        });

        context("question is specified", () => {
            it("should resolve with user input", () => {
                const result = promptUserInput("my question");

                // it doesn't trigger without \r, \n or \r\n
                const input = "user input text\r";
                process.stdin.emit("data", input);

                // the received text doesn't contain \r, \n, \r\n
                return expect(result).to.eventually.equal("user input text");
            });

            // without chai-as-promised
            it("should resolve with user input", (done) => {
                promptUserInput("my question").then((result) => {
                    try {
                        expect(result).to.equal("user input text");
                        done();
                    } catch (e) {
                        done(e);
                    }
                });

                // it doesn't trigger without \r, \n or \r\n
                const input = "user input text\r";
                process.stdin.emit("data", input);
            });
        });
    });
});
