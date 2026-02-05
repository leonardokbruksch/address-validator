import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpStatus,
} from "@nestjs/common";
import { ZodError } from "zod";

@Catch(ZodError)
export class ZodExceptionFilter implements ExceptionFilter {
    catch(exception: ZodError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        console.error("ZOD RESPONSE VALIDATION ERROR");
        console.error(exception.format());

        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: "Internal server error",
        });
    }
}