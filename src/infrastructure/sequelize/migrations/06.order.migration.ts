import { DataTypes, Sequelize } from 'sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable('orders', {
    id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false
    },
    clientName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'client_name'
    },
    clientEmail: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'client_email'
    },
    clientAddress: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'client_address'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  })
};

export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable('orders')
} 