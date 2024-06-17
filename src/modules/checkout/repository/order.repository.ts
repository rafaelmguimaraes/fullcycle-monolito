import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import OrderModel from "./order.model";

export default class OrderRepository implements CheckoutGateway {
    async addOrder(order: Order): Promise<void> {
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
                updatedAt: product.updatedAt,
                orderId: order.id.id
            })),
            createdAt: order.createdAt,
            updatedAt: order.updatedAt
        }, {
            include: ["items"]
        });
        
    }
    findOrder(id: string): Promise<Order | null> {
        return OrderModel.findByPk(id, {
            include: ["items"]
        }).then(order => {
            if (!order) {
                return null;
            }
            return new Order({
                id: new Id(order.id),
                client: new Client({
                    name: order.clientName,
                    email: order.clientEmail,
                    address: Address.fromString(order.clientAddress)
                }),
                products: order.items.map(item => ( new Product({
                    id: new Id(item.id),
                    name: item.productName,
                    description: item.productDescription,
                    salesPrice: item.productSalesPrice,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt
                }))),
                createdAt: order.createdAt,
                updatedAt: order.updatedAt
            });
        });
    }
}