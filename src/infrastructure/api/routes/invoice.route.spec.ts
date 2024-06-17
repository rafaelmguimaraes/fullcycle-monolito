import { InvoiceItemModel } from "../../../modules/invoice/repository/invoice-item.model";
import { InvoiceModel } from "../../../modules/invoice/repository/invoice.model";
import UmzugMigrator from "../../sequelize/migrator";
import { app, sequelize } from "../express";
import request from "supertest";

let migrator: UmzugMigrator;

describe("Invoice Route", () => {
  beforeAll(async () => {
    migrator = new UmzugMigrator(sequelize);
    await migrator.up();
    // await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await migrator.down();
  });

    it("should get an invoice", async () => {
        const invoiceDb = await InvoiceModel.create({
            id: '1i',
            name: 'Client',
            document: '123',
            street: 'Rua 123',
            number: '99',
            complement: 'Casa Verde',
            city: 'Criciúma',
            state: 'SC',
            zipcode: '88888-888',
            createdAt: new Date(),
            updatedAt: new Date()
        })
        const invoiceItem1 = await InvoiceItemModel.create({
            id: "1.1",
            invoiceId: "1i",
            name: "Item 1",
            price: 10,
            createdAt: new Date(),
            updatedAt: new Date()
        })
        const invoiceItem2 = await InvoiceItemModel.create({
            id: "1.2",
            invoiceId: "1i",
            name: "Item 2",
            price: 20,
            createdAt: new Date(),
            updatedAt: new Date()
        })
        await invoiceDb.$add('items', [invoiceItem1, invoiceItem2]);

        const response = await request(app)
        .get(`/invoice/${invoiceDb.id}`);
    
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(invoiceDb.id);
        expect(response.body.name).toBe(invoiceDb.name);
        expect(response.body.document).toBe(invoiceDb.document);
        expect(response.body.items.length).toBe(2);
        expect(response.body.total).toBe(30);
    

    });

});
