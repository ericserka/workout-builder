export type NotFoundError = {
  type: "NotFoundError"
  message: string
}

export type DatabaseError = {
  type: "DatabaseError"
  message: string
}

export type DomainError = NotFoundError | DatabaseError
