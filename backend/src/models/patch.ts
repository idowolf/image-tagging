import mongoose from 'mongoose';
import Image from './Image';
const updateKeys = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/imageDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const images = await Image.find({});

    for (const image of images) {
      // Update the `key` field to remove timestamp and hyphen
      const newKey = image.key.replace(/uploads\/\d+-/, 'uploads/');

      // Update keys inside `metadata` field
      const newMetadata = {};
      if (image.metadata) {
        for (const [metaKey, metaValue] of image.metadata.entries()) {
          newMetadata[metaKey] = metaValue.replace(/uploads\/\d+-/, 'uploads/');;
        }
      }

      // Perform the update
      await Image.updateOne(
        { _id: image._id },
        {
          $set: {
            key: newKey,
            metadata: newMetadata,
          },
        }
      );
    }

    console.log('All keys and metadata keys updated successfully.');
  } catch (err) {
    console.error('Error updating keys:', err);
  } finally {
    await mongoose.disconnect();
  }
};

updateKeys();
