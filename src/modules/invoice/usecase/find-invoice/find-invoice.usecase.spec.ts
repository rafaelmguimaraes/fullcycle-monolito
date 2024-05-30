import Address from '../../../@shared/domain/value-object/address';
import Id from '../../../@shared/domain/value-object/id.value-object';
import InvoiceItem from '../../domain/invoice-items.entity';
import Invoice from '../../domain/invoice.entity';
import FindInvoiceUseCase from './find-invoice.usecase';

const invoice = new Invoice({
    id: new Id("1"),
    name: "Fulano",
    document: "123456789",
    address: new Address(
        "Rua",
        "123",
        "Casa",
        "Cidade",
        "Estado",
        "12345678"
    ),
    items: [
        new InvoiceItem(
        {
            id: new Id("1.1"),
            name: "Produto 1",
            price: 10
        }),
        new InvoiceItem({
            id: new Id("1.2"),
            name: "Produto 2",
            price: 20
        })
    ]
})

const MockRepository = () => {
    return {
        generate: jest.fn(),
        find: jest.fn().mockResolvedValue(invoice)
    }
}

describe("Find Invoice use case unit test", () => {
    it("should find a invoice", async () => {
        const repository = MockRepository()
        const usecase = new FindInvoiceUseCase(repository)

        const input = {
            id: "1"
        }

        const result =  await usecase.execute(input)

        expect(repository.find).toHaveBeenCalled()
        expect(result.id).toBeDefined()
        expect(result.name).toEqual(invoice.name)
        expect(result.document).toEqual(invoice.document)
        expect(result.address).toEqual(invoice.address)
        expect(result.items.length).toEqual(2)
        expect(result.items[0].id).toEqual(invoice.items[0].id.id)
        expect(result.items[0].name).toEqual(invoice.items[0].name)
        expect(result.items[0].price).toEqual(invoice.items[0].price)
        expect(result.items[1].id).toEqual(invoice.items[1].id.id)
        expect(result.items[1].name).toEqual(invoice.items[1].name)
        expect(result.items[1].price).toEqual(invoice.items[1].price)
        expect(result.total).toEqual(30)
        expect(result.createdAt).toEqual(invoice.createdAt)
    })
})