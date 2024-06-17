import { Sequelize } from "sequelize-typescript";
import OrderModel from "../repository/order.model";
import OrderItemModel from "../repository/order-items.model";
import CheckoutFacadeFactory from "../factory/checkout.facade.factory";
import { ClientModel } from "../../client-adm/repository/client.model";
import { ProductModel as ProductAdmModel } from "../../product-adm/repository/product.model";

import ProductCatalogModel from "../../store-catalog/repository/product.model";
import TransactionModel from "../../payment/repository/transaction.model";
import { InvoiceModel } from "../../invoice/repository/invoice.model";
import { InvoiceItemModel } from "../../invoice/repository/invoice-item.model";
import UmzugMigrator from "../../../infrastructure/sequelize/migrator";


describe("Checkout Facade test", () => {
    let sequelize: Sequelize;
    let migrator: UmzugMigrator;
  
    beforeEach(async () => {
        
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            // sync: { force: true }
        });
    
        sequelize.addModels([
            ClientModel, 
            ProductAdmModel, 
            ProductCatalogModel, 
            TransactionModel,
            InvoiceModel,
            InvoiceItemModel,
            OrderModel,
            OrderItemModel]);
        migrator = new UmzugMigrator(sequelize);
        await migrator.up();
    })
  
    afterEach(async () => {
        await migrator.down();
        await sequelize.close();
    })

    it("should place an order", async () => {
       
        const facade = CheckoutFacadeFactory.create();

        const input = {
            clientId: "1c",
            products: [
              {
                productId: "1p",
              },
              {
                productId: "2p",
              },
            ]
        }

        const checkout = await facade.placeOrder(input);

        expect(checkout.id).toBeDefined();
        expect(checkout.invoiceId).toBeDefined();
        expect(checkout.status).toBe("approved");

        const orderDb = await OrderModel
             .findOne({ where: { id: checkout.id }, include: ["items"] });
        const clientDb = await ClientModel.findByPk("1c");
        const product1Db = await ProductCatalogModel.findByPk("1p");
        const product2Db = await ProductCatalogModel.findByPk("2p");
    
        expect(orderDb).toBeDefined();
        expect(checkout.id).toBe(orderDb.id);
        expect(orderDb.clientName).toBe(clientDb.name);
        expect(orderDb.clientEmail).toBe(clientDb.email);
        expect(orderDb.clientAddress).toContain(clientDb.street);
        expect(orderDb.items).toHaveLength(2);
        expect(orderDb.items[0].productName).toBe(product1Db.name);
        expect(orderDb.items[1].productName).toBe(product2Db.name);
        expect(checkout.total).toBe(product1Db.salesPrice + product2Db.salesPrice);

    });
});