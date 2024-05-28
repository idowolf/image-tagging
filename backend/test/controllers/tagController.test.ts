import { Request, Response } from 'express';
import { convertTextToTags, autocompleteTags } from '../../src/controllers/tagController';
import { generateTagsFromText, autocomplete } from '../../src/services/tagService';

jest.mock('../../src/services/tagService');

describe('Tag Controller', () => {
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
            json: jsonMock
        };
    });

    describe('convertTextToTags', () => {
        it('should return 400 if text parameter is missing', async () => {
            req.body = {};

            await convertTextToTags(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'Text parameter is required' });
        });

        it('should return 200 and tags if text parameter is provided', async () => {
            const tags = ['tag1', 'tag2'];
            (generateTagsFromText as jest.Mock).mockResolvedValue(tags);
            req.body = { text: 'some text' };

            await convertTextToTags(req as Request, res as Response);

            expect(generateTagsFromText).toHaveBeenCalledWith('some text');
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(tags);
        });

        it('should return 500 if there is an error', async () => {
            const errorMessage = 'Internal Server Error';
            (generateTagsFromText as jest.Mock).mockRejectedValue(new Error(errorMessage));
            req.body = { text: 'some text' };

            await convertTextToTags(req as Request, res as Response);

            expect(generateTagsFromText).toHaveBeenCalledWith('some text');
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ error: errorMessage });
        });
    });

    describe('autocompleteTags', () => {
        it('should return 400 if query parameter is missing', async () => {
            req.query = {};

            await autocompleteTags(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'Query parameter is required' });
        });

        it('should return 200 and autocomplete tags if query parameter is provided', async () => {
            const tags = ['tag1', 'tag2'];
            (autocomplete as jest.Mock).mockResolvedValue(tags);
            req.query = { query: 'tag' };

            await autocompleteTags(req as Request, res as Response);

            expect(autocomplete).toHaveBeenCalledWith('tag');
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(tags);
        });

        it('should return 500 if there is an error', async () => {
            const errorMessage = 'Internal Server Error';
            (autocomplete as jest.Mock).mockRejectedValue(new Error(errorMessage));
            req.query = { query: 'tag' };

            await autocompleteTags(req as Request, res as Response);

            expect(autocomplete).toHaveBeenCalledWith('tag');
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ error: errorMessage });
        });
    });
});
