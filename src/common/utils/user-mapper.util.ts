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
    dateOfBirth: user.dateOfBirth,
    firstDayInCompany: user.firstDayInCompany,
    phone: user.phone,
    salary: user.salary,
    stack: user.stack,
    social: user.social,
    bio: user.bio,
  };
};
