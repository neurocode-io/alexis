import * as z from 'zod'

const userSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string().min(5),
  pdfs: z.array(z.object({ id: z.string() })).optional()
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5)
})

type CreateUserInput = z.infer<typeof userSchema>

export { CreateUserInput, loginSchema, userSchema }
