import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import Invoice from "../../domain/invoice.entity";
import InvoiceGateway from "../../gateway/invoice.gateway";
import { FindInvoiceUseCaseInputDto, FindInvoiceUseCaseOutputDto } from "../find-invoice/find-invoice.usecase.dto";

export default class FindInvoiceUsecase implements UseCaseInterface {
  
  private _invoiceRepository: InvoiceGateway
  
  constructor(invoiceRepository: InvoiceGateway) {
    this._invoiceRepository = invoiceRepository
  }

  async execute(input: FindInvoiceUseCaseInputDto): Promise<FindInvoiceUseCaseOutputDto> {
    
    const result = await this._invoiceRepository.find(input.id)

    return {
      id: result.id.id,
      name: result.name,
      document: result.document,
      address: result.address,
      items: result.items.map(item => ({
        id: item.id.id,
        name: item.name,
        price: item.price
      })),
      total: result.total(),
      createdAt: result.createdAt
    }
  }
}