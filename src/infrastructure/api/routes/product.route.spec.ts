import UmzugMigrator from "../../sequelize/migrator";
import { app, sequelize } from "../express";
import request from "supertest";

let migrator: UmzugMigrator;

describe("Product Route", () => {
  beforeAll(async () => {
    migrator = new UmzugMigrator(sequelize);
    await migrator.up();
    // await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await migrator.down();
  });

  it("should add a product", async () => {
    const response = await request(app)
      .post("/products")
      .send({
        name: "Product Api",
        description: "Description Api",
        purchasePrice: 10.5,
        stock: 10,
      });

    expect(response.status).toBe(201);
  });

  it('should return 400 when a product is missing a property', async () => {
    const response = await request(app)
      .post('/products')
      .send({
        description: 'No Name Product Api',
        purchasePrice: 10.5,
        stock: 10,
      });

    expect(response.status).toBe(400);
  });

});