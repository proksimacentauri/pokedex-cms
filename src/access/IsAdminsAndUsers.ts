import { Access, AccessArgs } from "payload/config";

export const isAdminOrUser: Access = ({ req: { user } }) => {
  if (user) {
   return true;
  }

  return false;
}

export const isUserFieldLevel = ({ req: { user } } : AccessArgs) => {
  if (user) {
      return true;
  }

  return false;
}
