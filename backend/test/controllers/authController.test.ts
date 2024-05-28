import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../src/models/User';
import { registerUser, loginUser } from '../../src/controllers/authController';

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../../src/models/User');

describe('AuthController', () => {
  describe('registerUser', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseObject: any;

    beforeEach(() => {
      mockRequest = {};
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockImplementation((result) => {
          responseObject = result;
        })
      };
    });

    it('should register a new user', async () => {
      mockRequest = {
        body: {
          fullName: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          department: 'Engineering',
          team: 'Backend',
          role: 'Developer'
        }
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (User.prototype.save as jest.Mock).mockResolvedValue({});
      (jwt.sign as jest.Mock).mockReturnValue('token');

      await registerUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject).toEqual({ token: 'token' });
    });

    it('should return error if user already exists', async () => {
      mockRequest = {
        body: {
          email: 'test@example.com'
        }
      };

      (User.findOne as jest.Mock).mockResolvedValue({});

      await registerUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });

  describe('loginUser', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseObject: any;

    beforeEach(() => {
      mockRequest = {};
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockImplementation((result) => {
          responseObject = result;
        })
      };
    });

    it('should login a user', async () => {
      mockRequest = {
        body: {
          email: 'test@example.com',
          password: 'password123'
        }
      };

      (User.findOne as jest.Mock).mockResolvedValue({
        _id: 'userId',
        password: 'hashedpassword'
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('token');

      await loginUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject).toEqual({ token: 'token' });
    });

    it('should return error for invalid credentials', async () => {
      mockRequest = {
        body: {
          email: 'test@example.com',
          password: 'wrongpassword'
        }
      };

      (User.findOne as jest.Mock).mockResolvedValue({
        _id: 'userId',
        password: 'hashedpassword'
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await loginUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });
});
