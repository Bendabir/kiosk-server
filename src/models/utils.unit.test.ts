import { Model } from "sequelize";
import { fixAssociations } from "./utils";

class A extends Model {
    public key!: string;
}

// tslint:disable-next-line: max-classes-per-file
class B extends Model {
    public key!: string;
    public a!: string;
    public A!: A;
}

// tslint:disable-next-line: max-classes-per-file
class C extends Model {
    public key!: string;
    public b!: string;
    public B!: B;
}

describe("Model utils", () => {
    describe.skip("Fix Associations", () => {
        // tslint:disable-next-line: no-empty
        it("Should not affect objects without foreign keys", () => {});
        // tslint:disable-next-line: no-empty
        it("Should replace foreign key by objects", () => {});
        // tslint:disable-next-line: no-empty
        it("Should work with nested objects", () => {});
    });
});
