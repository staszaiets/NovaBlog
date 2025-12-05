import { z } from 'zod';

export const postFormSchema = z.object({
  authorName: z.string().min(3, 'Мінімум 1 символи'),
  title: z.string().min(3, 'Мінімум 3 символи'),
  slug: z
    .string()
    .min(3, 'Мінімум 3 символи')
    .regex(/^[a-z0-9-]+$/, 'Тільки маленькі латинські літери, цифри та дефіс'),
  content: z.string().min(10, 'Мінімум 10 символів'),
  excerpt: z.string().optional(),
  tags: z.string().optional(),
});

export type PostFormSchema = z.input<typeof postFormSchema>;

export const editPostFormSchema = postFormSchema.omit({ authorName: true });
export type EditPostFormSchema = z.infer<typeof editPostFormSchema>;
