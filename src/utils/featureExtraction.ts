import tf from '@tensorflow/tfjs-node';

export const loadModel = async (): Promise<tf.GraphModel> => {
    return await tf.loadGraphModel('file://src/tensorflow_models/mobilenet/model.json');
};

export const extractFeatures = async (imgBuffer: Buffer): Promise<number[]> => {
    const model = await loadModel();
    const image = tf.node.decodeImage(imgBuffer, 3);
    const resizedImage = tf.image.resizeBilinear(image, [224, 224]);
    const normalizedImage = resizedImage.div(255.0).expandDims(0);
    const features = model.predict(normalizedImage) as tf.Tensor;
    return Array.from(features.dataSync());
};
