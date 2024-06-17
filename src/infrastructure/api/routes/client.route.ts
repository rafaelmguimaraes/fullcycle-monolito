import { Request, Response, NextFunction, Router } from "express";
import ClientAdmFacadeFactory from "../../../modules/client-adm/factory/client-adm.facade.factory";
import Address from "../../../modules/@shared/domain/value-object/address";
import { ValidationError } from "sequelize";

export const clientRoute = Router();

clientRoute.post("/", async (req: Request, res: Response, next: NextFunction) => {
  const clientAdmFacade = ClientAdmFacadeFactory.create();
  try { 
    const input = {
      name: req.body.name,
      email: req.body.email,
      document: req.body.document,
      address: new Address(
        req.body.address?.street,
        req.body.address?.number,
        req.body.address?.complement,
        req.body.address?.city,
        req.body.address?.state,
        req.body.address?.zipCode
      ),
    };
    await clientAdmFacade.add(input);
    res.status(201).send();
  } catch (error) {
    if (error instanceof ValidationError) {
        res.status(400).send({message: error.message});
        return;
    }
    next(error);
  }
});