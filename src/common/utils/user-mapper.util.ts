import { User } from '@prisma/client';

export const userMapper = (user: User) => {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    status: user.status,
    position: user.position,
    salary: user.salary,
  };
};
