import { User } from '@prisma/client';

export const userMapper = (user: User) => {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    status: user.status,
  };
};
