import { describe, it, expect } from 'vitest';
import {
  loginSchema,
  forgotPasswordSchema,
  updatePasswordSchema,
} from '@/features/auth/schemas/auth.schema';

describe('Auth Validation Schemas', () => {
  it('validates correct login credentials', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'secret123',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email formats on login', () => {
    const result = loginSchema.safeParse({
      email: 'invalid-email',
      password: 'secret123',
    });
    expect(result.success).toBe(false);
  });

  it('validates forgot password email', () => {
    const valid = forgotPasswordSchema.safeParse({ email: 'user@example.com' });
    const invalid = forgotPasswordSchema.safeParse({ email: '' });
    expect(valid.success).toBe(true);
    expect(invalid.success).toBe(false);
  });

  it('enforces password confirmation equality in update password', () => {
    const mismatched = updatePasswordSchema.safeParse({
      current_password: 'current123',
      password: 'newpassword123',
      password_confirmation: 'different123',
    });
    expect(mismatched.success).toBe(false);

    const matched = updatePasswordSchema.safeParse({
      current_password: 'current123',
      password: 'newpassword123',
      password_confirmation: 'newpassword123',
    });
    expect(matched.success).toBe(true);
  });
});
