import { Injectable, HttpException } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class NewThrottlerGuard extends ThrottlerGuard {
  protected errorMessage =
    'Você esta fazendo muitos requests, tente novamente em alguns segundos';

  protected getTracker(req: Record<string, any>): string {
    return req.ips.length ? req.ips[0] : req.ip;
  }

  // throwThrottlingException(context: ExecutionContext): void {
  throwThrottlingException(): void {
    throw new HttpException({ error: this.errorMessage }, 429);
  }
}
