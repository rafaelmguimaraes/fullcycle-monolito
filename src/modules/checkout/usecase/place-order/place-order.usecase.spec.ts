import { PlaceOrderInputDto } from "./place-order.dto";
import PlaceOrderUsecase from "./place-order.usecase";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import { CreatedAt } from "sequelize-typescript";
import Address from "../../../@shared/domain/value-object/address";

const mockDate = new Date(2021, 1, 1);

describe("PlaceOrderUsecase unit test", () => {

    describe("validateProducts method", () => {
        //@ts-expect-error - no params needed for this test
        const placeOrderUseCase = new PlaceOrderUsecase();

        it("should throw an error when products are empty", async () => {
            const input: PlaceOrderInputDto = {
                clientId: "0",
                products: [],
            };

            await expect(placeOrderUseCase["validateProducts"](input))
                .rejects.toThrowError(
                    "No products selected"
                );
        });

        it("should throw an error when product is not available in stock", async () => {
            const mockProductFacade = {
                checkStock: jest.fn(({productId}: {productId: string}) =>
                    Promise.resolve({
                        productId,
                        stock: productId === "1" ? 0 : 1,
                    })
                ), 
            };
            //@ts-expect-error - private property - forced for testing
            placeOrderUseCase["_productFacade"] = mockProductFacade;

            let input: PlaceOrderInputDto = {
                clientId: "0",
                products: [
                    { productId: "1" },
                ],
            };

            await expect(placeOrderUseCase["validateProducts"](input))
                .rejects.toThrowError(
                    "Product 1 is not available in stock"
                );
            
            input = {
                clientId: "0",
                products: [
                    { productId: "0" },
                    { productId: "1" },
                ],
            };
            
            await expect(placeOrderUseCase["validateProducts"](input))
                .rejects.toThrowError(
                    "Product 1 is not available in stock"
                );
            expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(3);
        });

    });

    describe("getProduct method", () => {
        beforeAll(() => {
            jest.useFakeTimers("modern");
            jest.setSystemTime(mockDate);
        });
        afterAll(() => {
            jest.useRealTimers();
        });

        //@ts-expect-error - no params needed for this test
        const placeOrderUseCase = new PlaceOrderUsecase();

        it("should throw an error when product is not found", async () => {
            const mockCatalogFacade = {
                find: jest.fn().mockResolvedValue(null),
            };
            //@ts-expect-error - private property - forced for testing
            placeOrderUseCase["_catalogFacade"] = mockCatalogFacade;

            await expect(placeOrderUseCase["getProduct"]("0"))
                .rejects.toThrowError(
                    "Product not found"
                );
        });

        it("should return a product", async () => {
            const mockCatalogFacade = {
                find: jest.fn().mockResolvedValue({
                    id: "0",
                    name: "Product 0",
                    description: "Description 0",
                    salesPrice: 10,
                }),
            };
            //@ts-expect-error - private property - forced for testing
            placeOrderUseCase["_catalogFacade"] = mockCatalogFacade;

            const product = await placeOrderUseCase["getProduct"]("0");
            expect(product).toEqual(new Product({
                id: new Id("0"),
                name: "Product 0",
                description: "Description 0",
                salesPrice: 10,
            }));
            expect(mockCatalogFacade.find).toHaveBeenCalledTimes(1);
        });
    });

    describe("execute method", () => {
        beforeAll(() => {
            jest.useFakeTimers("modern");
            jest.setSystemTime(mockDate);
        });
        afterAll(() => {
            jest.useRealTimers();
        });
        
        it("should throw an error when client is not found", async () => {
            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(null),
            };
            //@ts-expect-error - no params needed for this test
            const placeOrderUseCase = new PlaceOrderUsecase();
            //@ts-expect-error - private property - forced for testing
            placeOrderUseCase["_clientFacade"] = mockClientFacade;

            const input: PlaceOrderInputDto = {
                clientId: "0",
                products: [],
            };

            await expect(placeOrderUseCase.execute(input)).rejects
                .toThrowError(
                    "Client not found"
                );
            
        });

        it("should throw an error when product are not valid", async () => {
            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(true),
            };
            //@ts-expect-error - no params needed for this test
            const placeOrderUseCase = new PlaceOrderUsecase();

            const mockValidateProducts = jest
                //@ts-expect-error - spy on private method
                .spyOn(placeOrderUseCase, "validateProducts")
                //@ts-expect-error - not return never
                .mockRejectedValue(new Error("No products selected"));
            
            //@ts-expect-error - private property - forced for testing
            placeOrderUseCase["_clientFacade"] = mockClientFacade;

            const input: PlaceOrderInputDto = {
                clientId: "1",
                products: [],
            };

            await expect(placeOrderUseCase.execute(input))
                .rejects.toThrowError(
                    "No products selected"
                );
            expect(mockValidateProducts).toHaveBeenCalledTimes(1);
            
        });

        describe("place an order", () => {
            const clientProps = {
                id: "1c",
                name: "Client 0",
                email: "client@user.com",
                document: "123.456.789-00",
                address: new Address(
                    "some address",
                    "123",
                    "apt 123",
                    "Some City",
                    "SC",
                    "12345-123"),
            };

            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(clientProps),
            };
            
            const mockPaymentFacade = {
                process: jest.fn(),
            };

            const mockCheckoutRepository = {
                addOrder: jest.fn(),
            }

            const mockInvoiceFacade = {
                generate: jest.fn().mockResolvedValue({ id: "1i" }),
            }

            const placeOrderUseCase = new PlaceOrderUsecase(
                mockClientFacade as any,
                null,
                null,
                mockCheckoutRepository as any,
                mockInvoiceFacade as any,
                mockPaymentFacade,
            );

            const products = {
                "1": new Product({
                    id: new Id("1"),
                    name: "Product 1",
                    description: "Description 1",
                    salesPrice: 40,
                }),
                "2": new Product({
                    id: new Id("2"),
                    name: "Product 2",
                    description: "Description 2",
                    salesPrice: 30,
                }),
            };

            const mockValidateProducts = jest
                //@ts-expect-error - spy on private method
                .spyOn(placeOrderUseCase, "validateProducts")
                //@ts-expect-error - not return never
                .mockResolvedValue(null);
            
            const mockGetProduct = jest
                //@ts-expect-error - spy on private method
                .spyOn(placeOrderUseCase, "getProduct")
                //@ts-expect-error - not return never
                .mockImplementation((productId: keyof typeof products) => Promise.resolve(products[productId]));
            
            it("should not be approved", async () => {
                mockPaymentFacade.process = jest.fn().mockResolvedValue({
                    transactionId: "1t",
                    orderId: "1o",
                    amount: 70,
                    status: "error",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });

                const input: PlaceOrderInputDto = {
                    clientId: "1c",
                    products: [
                        { productId: "1" },
                        { productId: "2" },
                    ],
                };
                
                let output = await placeOrderUseCase.execute(input);

                expect(output.invoiceId).toBeNull();
                expect(output.total).toBe(70);
                expect(output.products).toStrictEqual([
                    { productId: "1" },
                    { productId: "2" },
                ]);
                expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
                expect(mockClientFacade.find).toHaveBeenCalledWith({ id: "1c" });
                expect(mockValidateProducts).toHaveBeenCalledTimes(1);
                expect(mockValidateProducts).toHaveBeenCalledWith(input);
                expect(mockGetProduct).toHaveBeenCalledTimes(2);
                expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledWith({
                    orderId: output.id,
                    amount: output.total,
                })
                expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(0);

            });

            it("should be approved", async () => {
                mockPaymentFacade.process = jest.fn().mockResolvedValue({
                    transactionId: "1t",
                    orderId: "1o",
                    amount: 70,
                    status: "approved",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });

                const input: PlaceOrderInputDto = {
                    clientId: "1c",
                    products: [
                        { productId: "1" },
                        { productId: "2" },
                    ],
                };

                let output = await placeOrderUseCase.execute(input);

                expect(output.invoiceId).toBe("1i");
                expect(output.total).toBe(70);
                expect(output.products).toStrictEqual([
                    { productId: "1" },
                    { productId: "2" },
                ]);
                expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
                expect(mockClientFacade.find).toHaveBeenCalledWith({ id: "1c" });
                expect(mockValidateProducts).toHaveBeenCalledTimes(1);
                expect(mockGetProduct).toHaveBeenCalledTimes(2);
                expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledWith({
                    orderId: output.id,
                    amount: output.total,
                });
                expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(1);
                expect(mockInvoiceFacade.generate).toHaveBeenCalledWith({
                    name: clientProps.name,
                    document: clientProps.document,
                    street: clientProps.address.street,
                    number: clientProps.address.number,
                    complement: clientProps.address.complement,
                    city: clientProps.address.city,
                    state: clientProps.address.state,
                    zipCode: clientProps.address.zipCode,
                    items: [
                        {
                            id: products["1"].id.id,
                            name: products["1"].name,
                            price: products["1"].salesPrice,
                        },
                        {
                            id: products["2"].id.id,
                            name: products["2"].name,
                            price: products["2"].salesPrice,
                        },
                    ],
                })
            });
        });
        
    });
});