import { Request, Response } from 'express';
import { completeProfile } from '../../src/controllers/userController';
import User from '../../src/models/User';

jest.mock('../../src/models/User');

describe('UserController', () => {
    describe('completeProfile', () => {
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

        it('should complete user profile', async () => {
            mockRequest = {
                body: {
                    userId: 'userId',
                    department: 'Engineering',
                    team: 'Backend',
                    role: 'Developer'
                },
                user: { _id: 'userId' }
            };
            (User.findByIdAndUpdate as jest.Mock).mockResolvedValue({ _id: 'userId', department: 'Engineering', team: 'Backend', role: 'Developer' });

            await completeProfile(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(responseObject).toEqual({ _id: 'userId', department: 'Engineering', team: 'Backend', role: 'Developer' });
        });

        it('should return error if update fails', async () => {
            mockRequest = {
                body: {
                    userId: 'userId',
                    department: 'Engineering',
                    team: 'Backend',
                    role: 'Developer'
                }
            };

            (User.findByIdAndUpdate as jest.Mock).mockRejectedValue(new Error('Update failed'));

            await completeProfile(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
        });
    });
});
