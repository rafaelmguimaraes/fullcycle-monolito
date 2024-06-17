import { Router, Request, Response, NextFunction } from 'express';

import InvoiceFacadeFactory from '../../../modules/invoice/factory/invoice.facade.factory';

export const invoiceRoute = Router();

invoiceRoute.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    const invoiceFacade = InvoiceFacadeFactory.create();
    try {
        const result = await invoiceFacade.find({ id: req.params.id });
        res.status(200).send(result);
    } catch (error) {
        next(error);
    }
});