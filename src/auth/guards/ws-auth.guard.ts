import { CanActivate, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(
    context: any,
  ): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
    const bearerToken = context.args[0].handshake.query.token.toString();
    try {
      const decoded: any = this.authService.decode(bearerToken);
      return new Promise((resolve, reject) => {
        if (decoded) {
          context.args[0].handshake.query.user = decoded;
          resolve(true);
        } else {
          reject(false);
        }
      });
    } catch (ex) {
      console.log(ex);
      return false;
    }
  }
}
