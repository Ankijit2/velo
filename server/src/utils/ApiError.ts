class ApiError extends Error {
    statusCode: number;
    data: any | null;
    success: boolean;
    errors: string[] | any[];
    stack: any;

    constructor(
        statusCode: number,
        message: string = "Something went wrong",
        errors: string[] | any[] = [],
        stack: string = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };
