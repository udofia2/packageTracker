import crypto from 'crypto';
import { ApiError } from '../errors';
import httpStatus from 'http-status';

/**
 * Generates a unique and human-readable identifier.
 *
 * @param {string} type - The type of ID to generate ('package' or 'delivery').
 * @param {number} [length=6] - The length of the unique numeric or alphanumeric part.
 * @returns {string} - The generated unique identifier.
 */
export function generateReadableId(type: string, length = 6) {
  if (type !== 'package' && type !== 'delivery') {
    throw new ApiError(httpStatus.NOT_FOUND, "Invalid type. Must be 'package' or 'delivery'.");
  }

  const uniquePart = generateUniquePart(length);

  return type === 'package' ? `PKG${uniquePart}` : `DEL${uniquePart}`;
}

/**
 * Generates a unique part for the identifier.
 *
 * @param {number} length - The length of the unique part.
 * @returns {string} - The generated unique part.
 */
function generateUniquePart(length: number) {
  return crypto.randomBytes(length).toString('hex').slice(0, length).toUpperCase();
}
