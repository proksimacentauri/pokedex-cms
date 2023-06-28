import { AccessArgs } from "payload/types";

export const isAdmin = ({ req: { user } } : AccessArgs ) => {
  return Boolean(user?.roles?.includes('admin'));
}

export const isAdminFieldLevel = ({ req: { user } } : AccessArgs) => {
  return Boolean(user?.roles?.includes('admin'));
}