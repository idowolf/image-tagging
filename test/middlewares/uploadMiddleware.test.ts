import multer from 'multer';
import { upload } from '../../src/middlewares/uploadMiddleware';

describe('UploadMiddleware', () => {
  it('should configure multer storage with correct destination and filename', () => {
    const storage = (upload as any).storage;

    const req = {};
    const file = { originalname: 'testfile.jpg' } as Express.Multer.File;
    const cb = jest.fn();

    storage.getDestination(req, file, cb);
    expect(cb).toHaveBeenCalledWith(null, 'uploads/');

    storage.getFilename(req, file, cb);
    expect(cb).toHaveBeenCalledWith(null, expect.stringMatching(/^\d+-testfile\.jpg$/));
  });
});
