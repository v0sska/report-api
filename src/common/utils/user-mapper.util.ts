import { User } from '@prisma/client';

export const userMapper = (user: User) => {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
};
