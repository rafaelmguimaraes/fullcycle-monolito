import { Router, Request, Response, NextFunction } from 'express';
import CheckoutFacadeFactory from '../../../modules/checkout/factory/checkout.facade.factory';

export const checkoutRoute = Router();

checkoutRoute.post('/', async (req: Request, res: Response, next: NextFunction) => {
    const checkoutFacade = CheckoutFacadeFactory.create();
    try {
        const result = await checkoutFacade.placeOrder({
            clientId: req.body.clientId,
            products: req.body.products,
        });
        res.status(201).send(result);
    } catch (error) {
        next(error);
    }
});

