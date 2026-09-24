/**
 * Standard API Success Response
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {string} message
 * @param {any} data
 */
export const sendSuccess = (res, statusCode = 200, message = 'Success', data = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Standard API Error Response
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {string} message
 * @param {any} error
 */
export const sendError = (res, statusCode = 500, message = 'Something went wrong', error = {}) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'production' && statusCode === 500 ? {} : error
  });
};
