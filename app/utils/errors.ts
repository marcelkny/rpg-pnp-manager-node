export class InternalError extends Error {}
export class NotFoundError extends Error {}
export class NotImplementedError extends Error {
    constructor() {
        super("not implemented");
    }
}
export class InputValidationError extends Error {}
export class CredentialsError extends Error {}
export class UnexpectedSchemaError extends Error {
    constructor() {
        super("Unexpected Schema");
    }
}
export class SensorNotActiveError extends Error {
    constructor() {
        super("Sensor not activated");
    }
}
export class OperationNotAllowed extends Error {
    constructor() {
        super("Operation not allowed");
    }
}

export function makeErrorJSON(code: number, type: string, message: string) {
    return {
        code,
        type,
        message,
    };
}

export function makeOperationSuccessful(message: string = "Operation successful") {
    return makeErrorJSON(200, "Successful", message);
}

export function make400ErrorJSON(message: string = "The given request could not be handled!") {
    return makeErrorJSON(400, "Bad Request", message);
}
export function make401ErrorJSON(message: string = "Unauthorized!") {
    return makeErrorJSON(401, "Unauthorized", message);
}
export function make404ErrorJSON(message: string = "The requested Resource was not found!") {
    return makeErrorJSON(404, "Resource Not Found", message);
}

export function make405ErrorJSON(message: string = "Input validation failed!") {
    return makeErrorJSON(405, "Validation Failed", message);
}
