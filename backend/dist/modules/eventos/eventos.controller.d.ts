import { Request, Response } from 'express';
declare class EventosController {
    list(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    create(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    update(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    delete(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getCompleto(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
declare const _default: EventosController;
export default _default;
