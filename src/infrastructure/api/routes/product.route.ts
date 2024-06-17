
import { Router, Request, Response, NextFunction } from 'express';
import ProductAdmFacadeFactory from '../../../modules/product-adm/factory/facade.factory';
import { AddProductFacadeInputDto } from '../../../modules/product-adm/facade/product-adm.facade.interface';
import { ValidationError } from 'sequelize';

export const productRoute = Router();

productRoute.post('/', async (req: Request, res: Response, next: NextFunction) => {
        const productFacade = ProductAdmFacadeFactory.create();
        try {
                const input: AddProductFacadeInputDto = {
                    name: req.body.name,
                    description: req.body.description,
                    purchasePrice: req.body.purchasePrice,
                    stock: req.body.stock,
                };
        
                await productFacade.addProduct(input);
                res.status(201).send();
    } catch (error) {
        if (error instanceof ValidationError) {
            res.status(400).send({message: error.message});
            return;
        }
        next(error);
    }
});