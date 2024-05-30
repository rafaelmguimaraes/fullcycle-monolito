import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import InvoiceFacadeInterface, { FindInvoiceFacadeInputDto, FindInvoiceFacadeOutputDto, GenerateInvoiceFacadeInputDto, GenerateInvoiceFacadeOutputDto } from "./invoice.facade.interface";

export default class InvoiceFacade implements InvoiceFacadeInterface {
    private _generateInvoiceUseCase: UseCaseInterface
    private _findInvoiceUseCase: UseCaseInterface

    constructor(
        generateInvoiceUseCase: UseCaseInterface,
        findInvoiceUseCase: UseCaseInterface,
    ) {
        this._generateInvoiceUseCase = generateInvoiceUseCase
        this._findInvoiceUseCase = findInvoiceUseCase
    }

    async generate(input: GenerateInvoiceFacadeInputDto): Promise<GenerateInvoiceFacadeOutputDto> {
        return await this._generateInvoiceUseCase.execute(input)
    }

    async find(input: FindInvoiceFacadeInputDto): Promise<FindInvoiceFacadeOutputDto> {
        return await this._findInvoiceUseCase.execute(input)
    }
}