import * as z from 'zod'

const userSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string().min(5),
  pdfs: z.array(z.object({ id: z.string(), fileName: z.string() })).min(1)
})

type User = z.infer<typeof userSchema>

export { User }
