import { User } from '../../modals/User';

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}