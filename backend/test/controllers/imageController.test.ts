import { Request, Response } from 'express';
import { uploadImage, searchImages } from '../../src/controllers/imageController';
import { addImage, findImagesWithTags } from '../../src/services/imageService';
import fs from 'fs';
import { addImageToQueue } from '../../src/services/queueService';

jest.mock('../../src/services/imageService');
jest.mock('../../src/services/queueService');
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
  },
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
}));


describe('Image Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    req = {};
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    res = {
      status: statusMock,
      json: jsonMock,
      locals: {},
    };
  });

  describe('uploadImage', () => {
    it('should return 200 and the saved image if the file is provided', async () => {
      const imgBuffer = Buffer.from('test image buffer');
      const image = { _id: '123', key: 'uploads/test.jpg' };
      (fs.promises.readFile as jest.Mock).mockResolvedValue(imgBuffer);
      (addImage as jest.Mock).mockResolvedValue(image);
      (addImageToQueue as jest.Mock).mockResolvedValue(undefined);
      req.file = { path: 'test/path', originalname: 'test.jpg', mimetype: 'image/jpeg' } as Express.Multer.File;

      await uploadImage(req as Request, res as Response);

      expect(fs.promises.readFile).toHaveBeenCalledWith('test/path');
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Image upload initiated' });
    });

    it('should return 500 if no file is provided', async () => {
      req.file = undefined;

      await uploadImage(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'No file provided' });
    });

    it('should return 500 if there is an error', async () => {
      const errorMessage = 'Internal Server Error';
      (fs.promises.readFile as jest.Mock).mockRejectedValue(new Error(errorMessage));
      req.file = { path: 'test/path', originalname: 'test.jpg', mimetype: 'image/jpeg' } as Express.Multer.File;

      await uploadImage(req as Request, res as Response);

      expect(fs.promises.readFile).toHaveBeenCalledWith('test/path');
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('searchImages', () => {
    it('should return 400 if tags parameter is missing', async () => {
      req.body = {};

      await searchImages(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Tags parameter is required' });
    });

    it('should return 200 and images if tags parameter is provided', async () => {
      const tags = ['tag1', 'tag2'];
      const images = [{ _id: '1', key: 'uploads/test1.jpg' }, { _id: '2', key: 'uploads/test2.jpg' }];
      (findImagesWithTags as jest.Mock).mockResolvedValue(images);
      req.body = { tags: ['tag1','tag2'], pageNumber: '1', pageSize: '10' };

      await searchImages(req as Request, res as Response);
      expect(findImagesWithTags).toHaveBeenCalledWith(['tag1', 'tag2'], 1, 10);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(images);
    });

    it('should return 500 if there is an error', async () => {
      const errorMessage = 'Internal Server Error';
      (findImagesWithTags as jest.Mock).mockRejectedValue(new Error(errorMessage));
      req.body = { tags: 'tag1,tag2', pageNumber: '1', pageSize: '10' };

      await searchImages(req as Request, res as Response);

      expect(findImagesWithTags).toHaveBeenCalledWith(['tag1', 'tag2'], 1, 10);
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
});
