import * as bcrypt from 'bcryptjs';
import * as randomize from 'randomatic';

export function enCodePassword(rawPassword: string) {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(rawPassword, salt);
}

export function comparePassword(rawPassword: string, hash: string) {
  return bcrypt.compareSync(rawPassword, hash);
}

export const PasswordGenerator = (pattern: string, length: number) => {
  return randomize(pattern, length);
};

