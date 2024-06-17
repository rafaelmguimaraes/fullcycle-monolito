import { Sequelize } from "sequelize-typescript"
import { InvoiceItemModel } from "./invoice-item.model"
import { InvoiceModel } from "./invoice.model"
import Invoice from "../domain/invoice.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceRepository from "./invoice.repository";
import Address from "../../@shared/domain/value-object/address";
import InvoiceItem from "../domain/invoice-items.entity";

describe("Invoice Repository test", () => {

    let sequelize: Sequelize
  
    beforeEach(async () => {
      sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false,
        sync: { force: true }
      })
  
      sequelize.addModels([InvoiceModel, InvoiceItemModel])
      await sequelize.sync()
    })
  
    afterEach(async () => {
      await sequelize.close()
    })

    it("should generate a invoice", async () => {
        const invoiceItem1 = new InvoiceItem({
            id: new Id("1.1"),
            name: "Item 1",
            price: 10,
            createdAt: new Date(),
            updatedAt: new Date()
        })
        const invoiceItem2 = new InvoiceItem({
            id: new Id("1.2"),
            name: "Item 2",
            price: 20,
            createdAt: new Date(),
            updatedAt: new Date()
        })
        const invoice = new Invoice({
            id: new Id("1"),
            name: "Lucian",
            document: "123",
            address: new Address(
                "Rua 123",
                "99",
                "Casa Verde",
                "Criciúma",
                "SC",
                "88888-888"
              ),
            items: [
                invoiceItem1,
                invoiceItem2
            ],
            createdAt: new Date(),
            updatedAt: new Date()
        })
    
        const repository = new InvoiceRepository()
        await repository.generate(invoice)
    
        const invoiceDb = await InvoiceModel
            .findOne({ where: { id: "1" }, include: ["items"]})
    
        expect(invoiceDb).toBeDefined()
        expect(invoiceDb.id).toEqual(invoice.id.id)
        expect(invoiceDb.name).toEqual(invoice.name)
        expect(invoiceDb.document).toEqual(invoice.document)
        expect(invoiceDb.document).toEqual(invoice.document)
        expect(invoiceDb.street).toEqual(invoice.address.street)
        expect(invoiceDb.number).toEqual(invoice.address.number)
        expect(invoiceDb.complement).toEqual(invoice.address.complement)
        expect(invoiceDb.city).toEqual(invoice.address.city)
        expect(invoiceDb.state).toEqual(invoice.address.state)
        expect(invoiceDb.zipcode).toEqual(invoice.address.zipCode)
        expect(invoiceDb.createdAt).toStrictEqual(invoice.createdAt)
        expect(invoiceDb.updatedAt).toStrictEqual(invoice.updatedAt)
        expect(invoiceDb.items.length).toEqual(2)
        expect(invoiceDb.items[0].id).toEqual(invoiceItem1.id.id)
        expect(invoiceDb.items[0].name).toEqual(invoiceItem1.name)
        expect(invoiceDb.items[0].price).toEqual(invoiceItem1.price)
        expect(invoiceDb.items[0].createdAt).toStrictEqual(invoiceItem1.createdAt)
        expect(invoiceDb.items[0].updatedAt).toStrictEqual(invoiceItem1.updatedAt)
        expect(invoiceDb.items[1].id).toEqual(invoiceItem2.id.id)
        expect(invoiceDb.items[1].name).toEqual(invoiceItem2.name)
        expect(invoiceDb.items[1].price).toEqual(invoiceItem2.price)
        expect(invoiceDb.items[1].createdAt).toStrictEqual(invoiceItem2.createdAt)
        expect(invoiceDb.items[1].updatedAt).toStrictEqual(invoiceItem2.updatedAt)
    })

    it("should find a invoice", async () => {
        const invoice = await InvoiceModel.create({
            id: '1',
            name: 'Lucian',
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
            invoiceId: "1",
            name: "Item 1",
            price: 10,
            createdAt: new Date(),
            updatedAt: new Date()
        })
        const invoiceItem2 = await InvoiceItemModel.create({
            id: "1.2",
            invoiceId: "1",
            name: "Item 2",
            price: 20,
            createdAt: new Date(),
            updatedAt: new Date()
        })
        await invoice.$add('items', [invoiceItem1, invoiceItem2])
    
        const repository = new InvoiceRepository()
        const invoiceDB = await repository.find(invoice.id)
    
        expect(invoiceDB.id.id).toEqual(invoice.id)
        expect(invoiceDB.name).toEqual(invoice.name)
        expect(invoiceDB.document).toEqual(invoice.document)
        expect(invoiceDB.address.street).toEqual(invoice.street)
        expect(invoiceDB.address.number).toEqual(invoice.number)
        expect(invoiceDB.address.complement).toEqual(invoice.complement)
        expect(invoiceDB.address.city).toEqual(invoice.city)
        expect(invoiceDB.address.state).toEqual(invoice.state)
        expect(invoiceDB.address.zipCode).toEqual(invoice.zipcode)
        expect(invoiceDB.createdAt).toStrictEqual(invoice.createdAt)
        expect(invoiceDB.updatedAt).toStrictEqual(invoice.updatedAt)
        expect(invoiceDB.items.length).toEqual(2)
        expect(invoiceDB.items[0].id.id).toEqual(invoiceItem1.id)
        expect(invoiceDB.items[0].name).toEqual(invoiceItem1.name)
        expect(invoiceDB.items[0].price).toEqual(invoiceItem1.price)
        expect(invoiceDB.items[0].createdAt).toStrictEqual(invoiceItem1.createdAt)
        expect(invoiceDB.items[0].updatedAt).toStrictEqual(invoiceItem1.updatedAt)
        expect(invoiceDB.items[1].id.id).toEqual(invoiceItem2.id)
        expect(invoiceDB.items[1].name).toEqual(invoiceItem2.name)
        expect(invoiceDB.items[1].price).toEqual(invoiceItem2.price)
        expect(invoiceDB.items[1].createdAt).toStrictEqual(invoiceItem2.createdAt)
        expect(invoiceDB.items[1].updatedAt).toStrictEqual(invoiceItem2.updatedAt)
    })
});