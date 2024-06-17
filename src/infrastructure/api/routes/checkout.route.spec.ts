import UmzugMigrator from "../../sequelize/migrator";
import { app, sequelize } from "../express";
import request from "supertest";

import ProductCatalogModel from "../../../modules/store-catalog/repository/product.model";
import OrderModel from "../../../modules/checkout/repository/order.model";
import { ClientModel } from "../../../modules/client-adm/repository/client.model";
import { InvoiceModel } from "../../../modules/invoice/repository/invoice.model";

let migrator: UmzugMigrator;

describe("Checkout Route", () => {
  beforeAll(async () => {
    migrator = new UmzugMigrator(sequelize);
    await migrator.up();
    // await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await migrator.down();
  });

  it("should place a order", async () => {
    const response = await request(app)
      .post("/checkout")
      .send({
        clientId: "1c",
        products: [
            {
            productId: "1p",
            },
            {
            productId: "2p",
            },
        ]
      });

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.invoiceId).toBeDefined();
    expect(response.body.status).toBe("approved");

    const orderDb = await OrderModel
        .findOne({ where: { id: response.body.id }, include: ["items"] });
    const clientDb = await ClientModel.findByPk("1c");
    const product1Db = await ProductCatalogModel.findByPk("1p");
    const product2Db = await ProductCatalogModel.findByPk("2p");
    const invoiceDb = await InvoiceModel
        .findOne({ where: { id:response.body.invoiceId }, include: ["items"] });

    expect(orderDb).toBeDefined();
    expect(response.body.id).toBe(orderDb?.id);
    expect(orderDb?.clientName).toBe(clientDb?.name);
    expect(orderDb?.clientEmail).toBe(clientDb?.email);
    expect(orderDb?.clientAddress).toContain(clientDb?.street);
    expect(orderDb?.items).toHaveLength(2);
    expect(orderDb?.items[0].productName).toBe(product1Db?.name);
    expect(orderDb?.items[1].productName).toBe(product2Db?.name);
    expect(response.body.total).toBe(250);
    expect(invoiceDb).toBeDefined();
    expect(invoiceDb?.items).toHaveLength(2);
    expect(invoiceDb?.items[0].price).toBe(product1Db?.salesPrice);
    expect(invoiceDb?.items[1].price).toBe(product2Db?.salesPrice);
    expect(invoiceDb?.name).toBe(clientDb?.name);
  });

  

});