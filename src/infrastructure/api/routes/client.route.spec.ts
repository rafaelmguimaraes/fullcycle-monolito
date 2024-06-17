import { Sequelize } from "sequelize-typescript";
import UmzugMigrator from "../../sequelize/migrator";
import { app, sequelize } from "../express";
import request from "supertest";

import { ClientModel } from "../../../modules/client-adm/repository/client.model";




let migrator: UmzugMigrator;

  
describe("Client Route", () => {
  beforeAll(async () => {
    migrator = new UmzugMigrator(sequelize);
    await migrator.up();
    // await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await migrator.down();
  });

  it("should add a client", async () => {
    const clientProps = {
      name: "Client Api",
      email: "clientapi@email.com",
      document: "12345678901",
      address: {
          street: "Street 1",
          number: "10",
          complement: "Complement 1",
          city: "City 1",
          state: "State 1",
          zipCode: "12345678",
      }
    };

    const response = await request(app)
      .post("/clients")
      .send(clientProps);

    expect(response.status).toBe(201);

    // find the client in the database and compare the properties
    const clientDb = await ClientModel.findOne({ where: { email: clientProps.email } });
    
    expect(clientDb).toBeDefined();
    expect(clientDb.name).toBe(clientProps.name);
    expect(clientDb.email).toBe(clientProps.email);
    expect(clientDb.document).toBe(clientProps.document);
    expect(clientDb.street).toBe(clientProps.address.street);
    expect(clientDb.number).toBe(clientProps.address.number);
    expect(clientDb.complement).toBe(clientProps.address.complement);
    expect(clientDb.city).toBe(clientProps.address.city);
    expect(clientDb.state).toBe(clientProps.address.state);
    expect(clientDb.zipcode).toBe(clientProps.address.zipCode);


  });

  it("should return 400 when a client is missing a property", async () => {
    const response = await request(app)
      .post("/clients")
      .send({
        email: "client@email.com",
        document: "12345678901",
        address: {
          street: "Street 1",
          number: "10",
          city: "City 1",
          state: "State 1",
          complement: "Complement 1",
          zipCode: "12345678",
        }
      });

    expect(response.status).toBe(400);
  });
});
