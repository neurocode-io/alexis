import * as z from 'zod'

const userSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string(),
  pdfs: z.array(z.object({ id: z.string() })).optional()
})

type CreateUserInput = z.infer<typeof userSchema>

export { CreateUserInput, userSchema }
