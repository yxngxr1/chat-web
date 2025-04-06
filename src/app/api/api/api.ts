export * from './default.service';
import { DefaultService } from './default.service';
export * from './mockController.service';
import { MockControllerService } from './mockController.service';
export const APIS = [DefaultService, MockControllerService];
