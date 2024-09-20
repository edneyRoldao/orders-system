import { DocumentValidationResponse } from './response/document-validation.response'

export interface OrderValidatorClient {

    customerDocumentValidator(document: string): Promise<DocumentValidationResponse>

}