import { addImage, findImagesWithTags } from '../../src/services/imageService';
import Image from '../../src/models/Image';
import { generateTags } from '../../src/services/llmService';
import { generateEmbedding, upsertTags } from '../../src/services/tagService';
import { addToFaiss, searchFaissIndex } from '../../src/services/vectorService';

jest.mock('../../src/models/Image');
jest.mock('../../src/services/llmService');
jest.mock('../../src/services/tagService');
jest.mock('../../src/services/vectorService');

describe('imageService', () => {
    describe('addImage', () => {
        it('should add an image to the database and FAISS index', async () => {
            const imgBuffer = Buffer.from('test image buffer');
            const filename = 'test.jpg';
            const base64Image = imgBuffer.toString('base64');
            const tags = ['tag1', 'tag2'];
            const tagEmbeddings = [[0.1, 0.2, 0.3], [0.4, 0.5, 0.6]];
            const combinedEmbedding = tagEmbeddings[0].map((_, i) => (tagEmbeddings[0][i] + tagEmbeddings[1][i]) / 2);
            const imageId = 'imageId123';
            const savedImage = { _id: imageId, key: `uploads/${filename}` };

            (generateTags as jest.Mock).mockResolvedValue(tags);
            (upsertTags as jest.Mock).mockResolvedValue(tags);
            (generateEmbedding as jest.Mock).mockImplementation((tag) => {
                if (tag === 'tag1') return Promise.resolve(tagEmbeddings[0]);
                if (tag === 'tag2') return Promise.resolve(tagEmbeddings[1]);
            });
            (addToFaiss as jest.Mock).mockResolvedValue(tagEmbeddings);

            (Image as any).mockImplementation(() => ({
                save: jest.fn().mockResolvedValue(savedImage),
            }));
            (Image.create as jest.Mock).mockResolvedValue(savedImage);

            const result = await addImage(imgBuffer, filename);

            expect(generateTags).toHaveBeenCalledWith(base64Image);
            expect(upsertTags).toHaveBeenCalledWith(tags);
            expect(generateEmbedding).toHaveBeenCalledWith('tag1');
            expect(generateEmbedding).toHaveBeenCalledWith('tag2');
            expect(addToFaiss).toHaveBeenCalledWith(combinedEmbedding, imageId);
            expect(result).toEqual(savedImage);
        });
    });

    describe('findImagesWithTags', () => {
        it('should find images with the specified tags', async () => {
            const tags = ['tag1', 'tag2'];
            const page = 1;
            const resultsPerPage = 10;
            const tagEmbeddings = [[0.1, 0.2, 0.3], [0.4, 0.5, 0.6]];
            const imageIds = ['imageId1', 'imageId2'];
            const images = [{ _id: 'imageId1', key: 'uploads/test1.jpg' }, { _id: 'imageId2', key: 'uploads/test2.jpg' }];
            
            (generateEmbedding as jest.Mock).mockImplementation((tag) => {
                if (tag === 'tag1') return Promise.resolve(tagEmbeddings[0]);
                if (tag === 'tag2') return Promise.resolve(tagEmbeddings[1]);
            });
            (searchFaissIndex as jest.Mock).mockResolvedValue(imageIds);
            (Image.find as jest.Mock).mockImplementation(() => ({
                select: jest.fn().mockResolvedValue(images),
            }) as any);

            const result = await findImagesWithTags(tags, page, resultsPerPage);

            expect(generateEmbedding).toHaveBeenCalledWith('tag1');
            expect(generateEmbedding).toHaveBeenCalledWith('tag2');
            expect(searchFaissIndex).toHaveBeenCalledWith(tagEmbeddings, page, resultsPerPage);
            expect(Image.find).toHaveBeenCalledWith({ _id: { $in: imageIds } });
            expect(result).toEqual(images);
        });
    });
});
