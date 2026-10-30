export interface IProfileType{
    id: number;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    image?: string | null;
    roles: string[]
}