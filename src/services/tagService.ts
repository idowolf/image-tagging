import Tag from '../models/Tag';

export const upsertTags = async (tags: string[]) => {
    for (const tag of tags) {
        const now = new Date();
        await Tag.findOneAndUpdate(
            { name: tag },
            { $setOnInsert: { createdAt: now }, $set: { updatedAt: now }, $inc: { usageCount: 1 } },
            { upsert: true, new: true }
        );
    }
};

export const getTopTags = async (limit: number) => {
    return await Tag.find({}, 'name -_id').sort({ usageCount: -1 }).limit(limit);
};
