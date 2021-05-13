import { proxy, useSnapshot } from 'valtio'

type Pdf = {
  id?: string
  fileName: string
}

export type User = {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  pdfs: Pdf[]
}

type Store = {
  pdfs: Pdf[]
  name: string
}

export const store = proxy<Store>({
  pdfs: [],
  name: '',
})

const actions = {
  addUser(user: Omit<User, 'password'>) {
    store.name = `${user.firstName} ${user.lastName}`
    store.pdfs.push(...user.pdfs)
  },
  addPdf(pdf: Omit<Pdf, 'id'>) {
    store.pdfs.push(pdf)
  },
}

const useUser = () => {
  const snapShot = useSnapshot(store)

  return snapShot.name
}

const usePdf = () => {
  const snapShot = useSnapshot(store)

  return snapShot.pdfs.filter(({ fileName }) => fileName)
}

export { actions, useUser, usePdf }
