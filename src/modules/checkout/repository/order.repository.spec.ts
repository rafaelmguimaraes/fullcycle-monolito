import { Sequelize } from "sequelize-typescript";
import OrderItemModel from "./order-items.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";
import Client from "../domain/client.entity";
import Address from "../../@shared/domain/value-object/address";
import Product from "../domain/product.entity";
import Order from "../domain/order.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

describe("Order Repository test", () => {
    let sequelize: Sequelize
  
    beforeEach(async () => {
      sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false,
        sync: { force: true }
      })
  
      sequelize.addModels([OrderModel, OrderItemModel])
      await sequelize.sync()
    })
  
    afterEach(async () => {
      await sequelize.close()
    })

    it("should place a order", async () => {
        const client = new Client({
            name: "Client 1",
            email: "client01@fc.com",
            address: new Address(
                "Rua 123",
                "99",
                "Casa Verde",
                "Criciúma",
                "SC",
                "88888-888"
            )
        });

        const product1 = new Product({
            name: "Product 1",
            description: "Description 1",
            salesPrice: 40,
        });

        const product2 = new Product({
            name: "Product 2",
            description: "Description 2",
            salesPrice: 60,
        });

        const order = new Order({
            client,
            products: [product1, product2]
        });

        const repository = new OrderRepository();

        await repository.addOrder(order);

        const orderDB = await OrderModel.findOne({ where: { id: order.id.id }, include: ["items"] });

        expect(orderDB).not.toBeNull();
        expect(orderDB.clientName).toBe(client.name);
        expect(orderDB.clientEmail).toBe(client.email);
        expect(orderDB.clientAddress).toBe(client.address.toString());
        expect(orderDB.items.length).toBe(2);
        expect(orderDB.items[0].productName).toBe(product1.name);
        expect(orderDB.items[0].productDescription).toBe(product1.description);
        expect(orderDB.items[0].productSalesPrice).toBe(product1.salesPrice);
        expect(orderDB.items[1].productName).toBe(product2.name);
        expect(orderDB.items[1].productDescription).toBe(product2.description);
        expect(orderDB.items[1].productSalesPrice).toBe(product2.salesPrice);
        

    });

    it("should find a order", async () => {
        const client = new Client({
            name: "Client 1",
            email: "client01@fc.com",
            address: new Address(
                "Rua 123",
                "99",
                "Casa Verde",
                "Criciúma",
                "SC",
                "88888-888"
            )
        });

        const product1 = new Product({
            name: "Product 1",
            description: "Description 1",
            salesPrice: 40,
        });

        const product2 = new Product({
            name: "Product 2",
            description: "Description 2",
            salesPrice: 60,
        });

        const order = new Order({
            client,
            products: [product1, product2]
        });

        await OrderModel.create({
            id: order.id.id,
            clientName: order.client.name,
            clientEmail: order.client.email,
            clientAddress: order.client.address.toString(),
            items: order.products.map(product => ({
                id: product.id.id,
                productName: product.name,
                productDescription: product.description,
                productSalesPrice: product.salesPrice,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt
            })),
            createdAt: order.createdAt,
            updatedAt: order.updatedAt
        }, {
            include: ["items"]
        });

        const repository = new OrderRepository();
        const orderDb = await repository.findOrder(order.id.id);

        expect(orderDb).not.toBeNull();
        expect(orderDb.client.name).toBe(client.name);
        expect(orderDb.client.email).toBe(client.email);
        expect(orderDb.client.address).toStrictEqual(client.address);
        expect(orderDb.products.length).toBe(2);
        expect(orderDb.products[0].name).toBe(product1.name);
        expect(orderDb.products[0].description).toBe(product1.description);
        expect(orderDb.products[0].salesPrice).toBe(product1.salesPrice);
        expect(orderDb.products[1].name).toBe(product2.name);
        expect(orderDb.products[1].description).toBe(product2.description);
        expect(orderDb.products[1].salesPrice).toBe(product2.salesPrice);
    });
        
});