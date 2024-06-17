import { Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import OrderModel from './order.model';

@Table({
  tableName: 'order_items',
  timestamps: false
})
export default class OrderItemModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string

  @Column({ allowNull: false, field: 'product_name' })
  productName: string

  @Column({ allowNull: false, field: 'product_description' })
  productDescription: string

  @Column({ allowNull: false, field: 'product_sales_price' })
  productSalesPrice: number

  @ForeignKey(() => OrderModel)
  @Column({ allowNull: false, field: 'order_id' })
  orderId: string

  @Column({ allowNull: false })
  createdAt: Date

  @Column({ allowNull: false })
  updatedAt: Date
}