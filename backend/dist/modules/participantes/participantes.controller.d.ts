import { Request, Response } from 'express';
declare class ParticipantesController {
    list(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    create(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    update(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    delete(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    inscrever(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    transferir(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    checkin(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
declare const _default: ParticipantesController;
export default _default;
