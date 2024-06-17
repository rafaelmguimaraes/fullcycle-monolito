import express, { Express, Request, Response, NextFunction } from "express";
import { Sequelize } from "sequelize-typescript";
import { productRoute } from "./routes/product.route";
import { clientRoute } from "./routes/client.route";
import { checkoutRoute } from "./routes/checkout.route";
import { invoiceRoute } from "./routes/invoice.route";

import { ProductModel as ProductAdmModel  } from "../../modules/product-adm/repository/product.model";
import ProductCatalogModel from "../../modules/store-catalog/repository/product.model";
import { ClientModel } from "../../modules/client-adm/repository/client.model";
import OrderItemModel from "../../modules/checkout/repository/order-items.model";
import OrderModel from "../../modules/checkout/repository/order.model";
import { InvoiceItemModel } from "../../modules/invoice/repository/invoice-item.model";
import { InvoiceModel } from "../../modules/invoice/repository/invoice.model";
import TransactionModel from "../../modules/payment/repository/transaction.model";

export const app: Express = express();
app.use(express.json());

app.use("/products", productRoute);
app.use("/clients", clientRoute);
app.use("/checkout", checkoutRoute);
app.use("/invoice", invoiceRoute);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  res.status(500).send("Internal server error");
});

export let sequelize: Sequelize;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
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
}

setupDb();