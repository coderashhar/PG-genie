/**
 * Profile validation utilities for sanitizing and validating
 * user profile update requests.
 */

/**
 * Sanitize a string field by trimming whitespace and removing
 * potentially harmful HTML tags.
 */
export function sanitizeString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  // Strip HTML tags and trim
  return value.replace(/<[^>]*>/g, '').trim() || undefined;
}

/**
 * Validate a phone number format.
 * Accepts common formats: +91XXXXXXXXXX, 0XXXXXXXXXX, etc.
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+91\d{10}$/;
  return phoneRegex.test(phone);
}

/**
 * Validate email format.
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return emailRegex.test(email);
}

/**
 * Validate bio length constraint.
 */
export function isValidBio(bio: string): boolean {
  return bio.length <= 500;
}

/**
 * Validate and sanitize profile update data.
 * Accepts a user role to allow role-specific fields.
 * Returns an object with sanitized fields and any validation errors.
 */
export function validateProfileUpdate(
  body: Record<string, any>,
  role: 'student' | 'owner' = 'student'
): {
  data: Record<string, any>;
  errors: string[];
} {
  const errors: string[] = [];
  const data: Record<string, any> = {};

  // Name validation
  if (body.name !== undefined) {
    const name = sanitizeString(body.name);
    if (!name || name.length < 2) {
      errors.push('Name must be at least 2 characters long');
    } else if (name.length > 100) {
      errors.push('Name cannot exceed 100 characters');
    } else {
      data.name = name;
    }
  }

  // Email validation
  if (body.email !== undefined) {
    const email = sanitizeString(body.email);
    if (!email || !isValidEmail(email)) {
      errors.push('Please provide a valid email address');
    } else {
      data.email = email.toLowerCase();
    }
  }

  // Phone validation
  if (body.phone !== undefined) {
    const phone = sanitizeString(body.phone);
    if (phone && !isValidPhone(phone)) {
      errors.push('Invalid phone number format');
    } else {
      data.phone = phone || '';
    }
  }

  // University validation (student-specific, but allowed for all)
  if (body.university !== undefined) {
    const university = sanitizeString(body.university);
    if (university && university.length > 200) {
      errors.push('University name cannot exceed 200 characters');
    } else {
      data.university = university || '';
    }
  }

  // Batch validation (student-specific)
  if (body.batch !== undefined) {
    const batch = sanitizeString(body.batch);
    if (batch && !/^(20|21)\d{2}$/.test(batch)) {
      errors.push('Batch must be a valid 4-digit year (e.g. 2026)');
    } else {
      data.batch = batch || '';
    }
  }

  // Bio validation
  if (body.bio !== undefined) {
    const bio = sanitizeString(body.bio);
    if (bio && !isValidBio(bio)) {
      errors.push('Bio cannot exceed 500 characters');
    } else {
      data.bio = bio || '';
    }
  }

  // Address validation
  if (body.address !== undefined) {
    const address = sanitizeString(body.address);
    if (address && address.length > 300) {
      errors.push('Address cannot exceed 300 characters');
    } else {
      data.address = address || '';
    }
  }

  // Owner-specific fields
  if (role === 'owner') {
    if (body.businessName !== undefined) {
      const businessName = sanitizeString(body.businessName);
      if (businessName && businessName.length > 200) {
        errors.push('Business name cannot exceed 200 characters');
      } else {
        data.businessName = businessName || '';
      }
    }

    if (body.businessAddress !== undefined) {
      const businessAddress = sanitizeString(body.businessAddress);
      if (businessAddress && businessAddress.length > 300) {
        errors.push('Business address cannot exceed 300 characters');
      } else {
        data.businessAddress = businessAddress || '';
      }
    }
  }

  return { data, errors };
}
