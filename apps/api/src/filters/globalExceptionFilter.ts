import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
} from "@nestjs/common";

@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        console.error("🔥 Exception caught:", exception);

        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            response.status(status).json(exception.getResponse());
            return;
        }

        response.status(500).json({
            message: "Internal server error",
        });
    }
}