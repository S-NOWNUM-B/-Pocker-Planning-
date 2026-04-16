/**
 * Zod схемы валидации для форм аутентификации.
 *
 * LoginSchema — валидация для входа (email, пароль).
 * RegisterSchema — валидация для регистрации с требованиями к паролю:
 *  - Минимум 8 символов
 *  - Содержит хотя бы одну букву (a-z, A-Z)
 *  - Содержит хотя бы одну цифру (0-9)
 *  - Содержит хотя бы один спец символ (!@#$%^&*)
 *  - Подтверждение пароля совпадает
 */
import { z } from 'zod';

const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])/;

const basePasswordSchema = z
  .string()
  .min(8, 'Пароль должен быть минимум 8 символов')
  .regex(passwordRegex, 'Пароль должен содержать буквы, цифры и спец символы (!@#$%^&*)');

export const loginSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(1, 'Пароль обязателен'),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Имя должно быть минимум 2 символа')
      .max(120, 'Имя не должно превышать 120 символов'),
    email: z.string().email('Некорректный email'),
    password: basePasswordSchema,
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Пароли не совпадают',
    path: ['passwordConfirm'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
