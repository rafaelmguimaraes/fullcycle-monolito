import UseCaseInterface from "../../@shared/usecase/use-case.interface"
import CheckoutFacadeInterface, { PlaceOrderFacadeInputDto, PlaceOrderFacadeOutputDto } from "./checkout.facade.interface"

export default class CheckoutFacade implements CheckoutFacadeInterface {
    private _placeOrderUseCase: UseCaseInterface

    constructor(
        placeOrderUseCase: UseCaseInterface,
    ) {
        this._placeOrderUseCase = placeOrderUseCase
    }

    async placeOrder(input: PlaceOrderFacadeInputDto): Promise<PlaceOrderFacadeOutputDto> {
        return await this._placeOrderUseCase.execute(input)
    }
}