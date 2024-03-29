import { Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';
import { Request, Response } from 'express';

type CustomResponseObject = {
    statusCode: number,
    timestamp: string,
    path: string,
    response: string | object,
}

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const customResponseObject: CustomResponseObject = {
            statusCode: 500,
            timestamp: new Date().toISOString(),
            path: request.url,
            response: '',
        }

        if (exception instanceof HttpException) {
            customResponseObject.statusCode = exception.getStatus()
            customResponseObject.response = exception.getResponse()
        } else if (exception instanceof PrismaClientKnownRequestError || exception instanceof PrismaClientUnknownRequestError || exception instanceof PrismaClientValidationError) {
            // Add more Prisma Error Types and customize as needed
            customResponseObject.statusCode = HttpStatus.UNPROCESSABLE_ENTITY
            customResponseObject.response = exception.message.replaceAll(/\n/g, ' ')
        } else {
            customResponseObject.statusCode = HttpStatus.INTERNAL_SERVER_ERROR
            customResponseObject.response = 'Internal Server Error'
        }

        response
            .status(customResponseObject.statusCode)
            .json(customResponseObject)

        super.catch(exception, host)
    }
}