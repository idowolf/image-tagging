import * as tagService from '../../src/services/tagService';

jest.mock('axios');

describe('TagService', () => {
    describe('upsertTags', () => {
        it('should upsert tags', async () => {
            const tags = ['tag1', 'tag2'];
            const upsertSpy = jest.spyOn(tagService, 'upsertTags').mockResolvedValue(undefined);

            await tagService.upsertTags(tags);

            expect(upsertSpy).toHaveBeenCalledWith(tags);
        });
    });
});
