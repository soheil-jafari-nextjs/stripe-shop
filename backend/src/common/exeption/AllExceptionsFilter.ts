import { ExceptionFilter, Catch, ArgumentsHost, HttpException, } from "@nestjs/common";

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
   catch(exception: HttpException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();

      const status = exception.getStatus();
      const res = exception.getResponse();

      response.status(status).json({
         message: (res as any).message || "Site Server Error",
         data: (res as any).data || null,
         success: false,
      });
   }
}