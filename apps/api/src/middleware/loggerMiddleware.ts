import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const start = process.hrtime.bigint();

        const originalSend = res.send.bind(res);
        let responseBody: any;

        res.send = (body: any) => {
            responseBody = body;
            return originalSend(body);
        };

        res.on('finish', () => {
            const end = process.hrtime.bigint();
            const durationMs = Number(end - start) / 1_000_000;

            console.log(
                `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs.toFixed(2)}ms`
            );

            if (req.method === 'POST') {
                console.log('Request Body:', JSON.stringify(req.body));
            }

            if (responseBody !== undefined) {
                console.log('Response Body:', typeof responseBody === 'string'
                    ? responseBody
                    : JSON.stringify(responseBody)
                );
            }
        });

        next();
    }
}
