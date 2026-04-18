import { z } from 'zod';

// Схема для валидации данных пользователя
export const UserShema = z.object({
  id: z.string(),
  email: z.string().email('Некорректный email'),
  username: z
    .string()
    .min(3, 'Имя пользователя должно быть не менее 3 символов')
    .max(16, 'Имя пользователя должно быть не более 16 символов'),
  avatarColor: z.string().optional().nullable(),
  createdAt: z.string(),
});

// Схема для валидации данных при логине
export const LoginSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Пароль должен быть не менее 6 символов'),
});

// Схема для валидации данных при регистрации
export const RegisterSchema = z
  .object({
    email: z.string().email('Некорректный email'),
    username: z
      .string()
      .min(3, 'Имя пользователя должно быть не менее 3 символов')
      .max(16, 'Имя пользователя должно быть не более 16 символов'),
    password: z.string().min(6, 'Пароль должен быть не менее 6 символов'),
    confirmPassword: z.string().min(6, 'Пароль должен быть не менее 6 символов'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

// Алиасы в camelCase для обратной совместимости с текущими импортами.
export const loginSchema = LoginSchema;
export const registerSchema = RegisterSchema;

// Схемы для валидации ответов от сервера при логине и регистрации
export const LoginResponseSchema = z.object({
  user: UserShema,
  accessToken: z.string(),
});

export const RegisterResponseSchema = z.object({
  user: UserShema,
  accessToken: z.string(),
});

// Типы данных, выводимые из схем
export type User = z.infer<typeof UserShema>;
export type LoginCredentials = z.infer<typeof LoginSchema>;
export type RegisterCredentials = z.infer<typeof RegisterSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;
