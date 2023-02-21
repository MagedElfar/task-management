'use strict';
import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import * as fs from "fs"
import * as path from 'path';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private logger = new Logger('HTTP');

    use(request: Request, response: Response, next: NextFunction): void {
        const startAt = process.hrtime();
        const { ip, method, originalUrl } = request;
        const userAgent = request.get('user-agent') || '';

        const date = new Date();

        // Get year, month, and day part from the date
        const year = date.toLocaleString("default", { year: "numeric" });
        const month = date.toLocaleString("default", { month: "2-digit" });
        const day = date.toLocaleString("default", { day: "2-digit" });

        const fileName = `${year}-${month}-${day}-logging.txt`;



        const file = path.join(path.dirname(__dirname), "..", "..", "public", "logging", fileName)

        let fileContent = ""


        if (!fs.existsSync(file)) {
            fs.createWriteStream(fileName, {
                flags: `a`,

            });
        }


        response.on('finish', () => {
            const { statusCode } = response;
            const contentLength = response.get('content-length');
            const diff = process.hrtime(startAt);
            const responseTime = diff[0] * 1e3 + diff[1] * 1e-6;


            this.logger.log(
                `${method} ${originalUrl} ${statusCode} - ${Math.round((responseTime + Number.EPSILON) * 100) / 100}ms ${contentLength} - ${userAgent} ${ip}`,
            );

            fileContent = `
${request?.user ? `user: ${request.user["username"]}
userId: ${request.user["id"]}` : "request with no authorization required"}
${method} ${originalUrl} ${statusCode} - ${Math.round((responseTime + Number.EPSILON) * 100) / 100}ms ${contentLength} - ${userAgent} ${ip}
----------------------------------------------------------------------------`

            fs.appendFile(file, fileContent, function (err: any) {
                if (err) console.log(err)
            })
        });

        let send = response.send;
        response.send = (exitData) => {
            if (
                response?.getHeader('content-type')?.toString().includes('application/json')
            ) {
                console.log({
                    code: response.statusCode,
                    exit: exitData.toString().substring(0, 1000),
                    endDate: new Date(),
                });

                fs.appendFile(file, `
exit: ${exitData.toString().substring(0, 1000)}
endDate: ${new Date()} `, function (err: any) {
                    if (err) console.log(err)
                })
            }

            response.send = send;
            return response.send(exitData);
        };





        next();
    }
}