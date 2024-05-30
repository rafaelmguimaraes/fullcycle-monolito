import Address from "../../../@shared/domain/value-object/address"
import Id from "../../../@shared/domain/value-object/id.value-object"
import GenerateInvoiceUseCase from "./gerenarte-invoice.usecase"

const MockRepository = () => {
    return {
        generate: jest.fn(),
        find: jest.fn()
    }
}

describe("Generate Invoice use case unit test", () => {
    it("should generate a invoice", async () => {
        const repository = MockRepository()
        const usecase = new GenerateInvoiceUseCase(repository)

        const input = {
            name: "Lucian",
            document: "123",
            street: "Rua 123",
            number: "99",
            complement: "Casa Verde",
            city: "Criciúma",
            state: "SC",
            zipCode: "88888-888",
            items: [
                {
                    id: "1.1",
                    name: "Item 1",
                    price: 10,
                },
                {
                    id: "1.2",
                    name: "Item 2",
                    price: 20,
                }
            ]
        }

        const result =  await usecase.execute(input)

        expect(repository.generate).toHaveBeenCalled()
        expect(result.id).toBeDefined()
        expect(result.name).toEqual(input.name)
        expect(result.document).toEqual(input.document)
        expect(result.street).toEqual(input.street)
        expect(result.number).toEqual(input.number)
        expect(result.complement).toEqual(input.complement)
        expect(result.city).toEqual(input.city)
        expect(result.state).toEqual(input.state)
        expect(result.zipCode).toEqual(input.zipCode)
        expect(result.items.length).toEqual(2)
        expect(result.items[0].id).toEqual(input.items[0].id)
        expect(result.items[0].name).toEqual(input.items[0].name)
        expect(result.items[0].price).toEqual(input.items[0].price)
        expect(result.items[1].id).toEqual(input.items[1].id)
        expect(result.items[1].name).toEqual(input.items[1].name)
        expect(result.items[1].price).toEqual(input.items[1].price)
        expect(result.total).toEqual(30)
    })
})