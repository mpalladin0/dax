import { CustomError } from 'ts-custom-error'

export class ControllerError extends CustomError {
    constructor(message?: string) {
        super(message)
    }
}