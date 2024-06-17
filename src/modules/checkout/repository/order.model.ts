import { Column, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import OrderItemModel from './order-items.model';

@Table({
  tableName: 'orders',
  timestamps: false
})
export default class OrderModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string

  @Column({ allowNull: false, field: 'client_name' })
  clientName: string

  @Column({ allowNull: false, field: 'client_email' })
  clientEmail: string

  @Column({ allowNull: false, field: 'client_address' })
  clientAddress: string
  
  @Column({ allowNull: false })
  createdAt: Date

  @Column({ allowNull: false })
  updatedAt: Date

  @HasMany(() => OrderItemModel)
  items: OrderItemModel[]
}