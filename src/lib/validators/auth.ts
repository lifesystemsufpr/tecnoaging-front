import z from "zod";

export const loginSchema = z.object({
    username: z.string().min(1, "Campo obrigatório").max(11, "Máximo 11 caracteres"),
    password: z.string().min(1, "Campo obrigatório").max(100, "Máximo 100 caracteres"),
});