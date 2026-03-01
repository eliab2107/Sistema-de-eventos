interface LoginResponse {
    token: string;
    user: {
        id: string;
        email: string;
    };
}
declare class AuthService {
    login(email: string, password: string): Promise<LoginResponse>;
}
declare const _default: AuthService;
export default _default;
