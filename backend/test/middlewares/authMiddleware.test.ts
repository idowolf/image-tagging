import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../../src/middlewares/authMiddleware';
import User from '../../src/models/User';

jest.mock('jsonwebtoken');
jest.mock('../../src/models/User');

describe('AuthMiddleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let responseObject: any;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => {
        responseObject = result;
      })
    };
    mockNext = jest.fn();
  });

  it('should authenticate user with valid token', async () => {
    mockRequest = {
      header: jest.fn().mockReturnValue('Bearer validToken')
    };

    (jwt.verify as jest.Mock).mockReturnValue({ userId: 'userId' });
    (User.findById as jest.Mock).mockResolvedValue({ _id: 'userId' });

    await authMiddleware(mockRequest as Request, mockResponse as Response, mockNext);
    
    expect(mockNext).toHaveBeenCalled();
  });

  it('should return error if no token is provided', async () => {
    mockRequest = {
      header: jest.fn().mockReturnValue(null)
    };

    await authMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(responseObject).toEqual({ error: 'Access denied, no token provided' });
  });

  it('should return error if token is invalid', async () => {
    mockRequest = {
      header: jest.fn().mockReturnValue('Bearer invalidToken')
    };

    (jwt.verify as jest.Mock).mockImplementation(() => { throw new Error('Invalid token'); });

    await authMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(responseObject).toEqual({ error: 'Invalid token' });
  });

  it('should return error if user is not found', async () => {
    mockRequest = {
      header: jest.fn().mockReturnValue('Bearer validToken')
    };

    (jwt.verify as jest.Mock).mockReturnValue({ userId: 'userId' });
    (User.findById as jest.Mock).mockResolvedValue(null);

    await authMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(responseObject).toEqual({ error: 'User not found' });
  });
});
