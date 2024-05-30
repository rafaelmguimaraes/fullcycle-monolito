import { Sequelize } from "sequelize-typescript"
import { InvoiceModel } from "../repository/invoice.model"
import { InvoiceItemModel } from "../repository/invoice-item.model"
import InvoiceRepository from "../repository/invoice.repository"
import GenerateInvoiceUseCase from "../usecase/generate-invoice/gerenarte-invoice.usecase"
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase"
import Address from "../../@shared/domain/value-object/address"
import InvoiceFacade from "./invoice.facade"

describe("Invoice Facade test", () => {
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
        const repository = new InvoiceRepository()
        const generateInvoiceUseCase = new GenerateInvoiceUseCase(repository)
        const facade = new InvoiceFacade(generateInvoiceUseCase, undefined)

        const input = {
            id: "1",
            name: "Lucian",
            document: "1234-567Z",
            street: "Rua 123",
            number:  "99",
            complement: "Casa Verde",
            city: "Criciúma",
            state: "SC",
            zipCode: "88888-888",
            items: [
              {
                id: "1",
                name: "Item 1",
                price: 100,
              },
              {
                id: "2",
                name: "Item 2",
                price: 50,
              },
            ]
        }

        await facade.generate(input)

        const invoice = await InvoiceModel
            .findOne({ where: { id: "1" }, 
                include: ["items"] 
            })
        
        expect(invoice).toBeDefined()
        expect(invoice.id).toBe(input.id)
        expect(invoice.name).toBe(input.name)
        expect(invoice.document).toBe(input.document)
        expect(invoice.street).toBe(input.street)
        expect(invoice.number).toBe(input.number)
        expect(invoice.complement).toBe(input.complement)
        expect(invoice.city).toBe(input.city)
        expect(invoice.state).toBe(input.state)
        expect(invoice.zipCode).toBe(input.zipCode)
        expect(invoice.items).toBeDefined()
        expect(invoice.items.length).toBe(2)
        expect(invoice.items[0].name).toBe(input.items[0].name)
        expect(invoice.items[0].price).toBe(input.items[0].price)
        expect(invoice.items[1].name).toBe(input.items[1].name)
        expect(invoice.items[1].price).toBe(input.items[1].price)
    })

    it("should find a invoice", async () => {
        const repository = new InvoiceRepository()
        const findInvoiceUseCase = new FindInvoiceUseCase(repository)
        const facade = new InvoiceFacade(undefined, findInvoiceUseCase)
   
        const input = await InvoiceModel.create({
            id: '1',
            name: 'Lucian',
            document: '123',
            street: 'Rua 123',
            number: '99',
            complement: 'Casa Verde',
            city: 'Criciúma',
            state: 'SC',
            zipCode: '88888-888',
            createdAt: new Date(),
            updatedAt: new Date()
        })
        const invoiceItem1 = await InvoiceItemModel.create({
            id: "1.1",
            invoice_id: "1",
            name: "Item 1",
            price: 10,
            createdAt: new Date(),
            updatedAt: new Date()
        })
        const invoiceItem2 = await InvoiceItemModel.create({
            id: "1.2",
            invoice_id: "1",
            name: "Item 2",
            price: 20,
            createdAt: new Date(),
            updatedAt: new Date()
        })
        await input.$add('items', [invoiceItem1, invoiceItem2])

        const result = await facade.find({id: "1"})

        expect(result).toBeDefined()
        expect(result.id).toBe(input.id)
        expect(result.name).toBe(input.name)
        expect(result.document).toBe(input.document)
        expect(result.address.street).toBe(input.street)
        expect(result.address.number).toBe(input.number)
        expect(result.address.complement).toBe(input.complement)
        expect(result.address.city).toBe(input.city)
        expect(result.address.state).toBe(input.state)
        expect(result.address.zipCode).toBe(input.zipCode)
        expect(result.items).toBeDefined()
        expect(result.items.length).toBe(2)
        expect(result.items[0].name).toBe(invoiceItem1.name)
        expect(result.items[0].price).toBe(invoiceItem1.price)
        expect(result.items[1].name).toBe(invoiceItem2.name)
        expect(result.items[1].price).toBe(invoiceItem2.price)
        expect(result.total).toBe(invoiceItem1.price + invoiceItem2.price)
    })
})