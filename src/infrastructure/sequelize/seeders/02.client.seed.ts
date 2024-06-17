import { Sequelize } from 'sequelize-typescript';
import { MigrationFn } from 'umzug';

// Função para aplicar o seed
export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().bulkInsert('clients', [
    {
      id: '1c',
      name: 'Client 1',
      email: 'client1@example.com',
      document: '12345678900',
      street: '123 Main Street',
      number: '101',
      complement: 'Apt 1',
      city: 'New York',
      state: 'NY',
      zipcode: '10001',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2c',
      name: 'Client 2',
      email: 'client2@example.com',
      document: '98765432100',
      street: '456 Elm Street',
      number: '202',
      complement: 'Suite 2',
      city: 'Los Angeles',
      state: 'CA',
      zipcode: '90001',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3c',
      name: 'Client 3',
      email: 'client3@example.com',
      document: '55544477700',
      street: '789 Oak Street',
      number: '303',
      complement: 'Unit 3',
      city: 'Chicago',
      state: 'IL',
      zipcode: '60001',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ]);
};

// Função para reverter o seed (opcional, mas recomendado)
export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().bulkDelete('clients', { id: ['1c', '2c', '3c'] });
};