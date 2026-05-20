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
  const phoneRegex = /^(\+?\d{1,3}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
  return phoneRegex.test(phone);
}

/**
 * Validate bio length constraint.
 */
export function isValidBio(bio: string): boolean {
  return bio.length <= 500;
}

/**
 * Validate image URL format.
 */
export function isValidImageUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate and sanitize profile update data.
 * Returns an object with sanitized fields and any validation errors.
 */
export function validateProfileUpdate(body: Record<string, any>): {
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

  // Phone validation
  if (body.phone !== undefined) {
    const phone = sanitizeString(body.phone);
    if (phone && !isValidPhone(phone)) {
      errors.push('Invalid phone number format');
    } else {
      data.phone = phone || '';
    }
  }

  // Image URL validation
  if (body.image !== undefined) {
    const image = sanitizeString(body.image);
    if (image && !isValidImageUrl(image)) {
      errors.push('Invalid image URL');
    } else {
      data.image = image || '';
    }
  }

  // University validation
  if (body.university !== undefined) {
    const university = sanitizeString(body.university);
    if (university && university.length > 200) {
      errors.push('University name cannot exceed 200 characters');
    } else {
      data.university = university || '';
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

  return { data, errors };
}
