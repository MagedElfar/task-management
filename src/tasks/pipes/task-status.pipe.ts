import { ArgumentMetadata, Injectable, PipeTransform, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class TaskStatusPipe implements PipeTransform {

    transform(value: any, metadata: ArgumentMetadata) {

        if (metadata.type === "query" || metadata.type === "body") {
            if (value?.status) value.status = value.status.toUpperCase();
        }


        return value;
    }
}
