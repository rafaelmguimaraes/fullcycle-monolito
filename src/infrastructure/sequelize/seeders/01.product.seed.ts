import { Sequelize } from 'sequelize';
import { MigrationFn } from 'umzug';

// Função para aplicar o seed
export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  try {
  await sequelize.getQueryInterface().bulkInsert('products', [
    {
      id: '1p',
      name: 'Product 1',
      description: 'Description of Product 1',
      purchasePrice: 50,
      salesPrice: 100,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2p',
      name: 'Product 2',
      description: 'Description of Product 2',
      purchasePrice: 75,
      salesPrice: 150,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3p',
      name: 'Product 3',
      description: 'Description of Product 3',
      purchasePrice: 40,
      salesPrice: 80,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ]);
  } catch (error) {
    console.log(error);
  }
};

// Função para reverter o seed (opcional, mas recomendado)
export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().bulkDelete('products', { id: ['1p', '2p', '3p'] });
};