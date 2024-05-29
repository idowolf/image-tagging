const mockSearchResult = {
  distances: [0.1, 0.2, 0.3],
  labels: [1, 2, 3]
};

const mockIndex = {
  ntotal: jest.fn().mockReturnValue(10),
  getDimension: jest.fn().mockReturnValue(128),
  isTrained: jest.fn().mockReturnValue(true),
  add: jest.fn(),
  train: jest.fn(),
  search: jest.fn().mockReturnValue(mockSearchResult),
  write: jest.fn(),
  toBuffer: jest.fn().mockReturnValue(Buffer.from("mockBuffer")),
  removeIds: jest.fn().mockReturnValue(1),
  mergeFrom: jest.fn()
};

const Index = jest.fn().mockImplementation(() => mockIndex);

Index.read = jest.fn().mockReturnValue(mockIndex);
Index.fromBuffer = jest.fn().mockReturnValue(mockIndex);
Index.fromFactory = jest.fn().mockReturnValue(mockIndex);

const mockIndexFlatL2 = {
  ...mockIndex,
  mergeFrom: jest.fn()
};

const IndexFlatL2 = jest.fn().mockImplementation(() => mockIndexFlatL2);

IndexFlatL2.read = jest.fn().mockReturnValue(mockIndexFlatL2);
IndexFlatL2.fromBuffer = jest.fn().mockReturnValue(mockIndexFlatL2);

const mockIndexFlatIP = {
  ...mockIndex,
  mergeFrom: jest.fn()
};

const IndexFlatIP = jest.fn().mockImplementation(() => mockIndexFlatIP);

IndexFlatIP.read = jest.fn().mockReturnValue(mockIndexFlatIP);
IndexFlatIP.fromBuffer = jest.fn().mockReturnValue(mockIndexFlatIP);

module.exports = {
  Index,
  IndexFlatL2,
  IndexFlatIP,
  mockIndex,
  mockSearchResult
};
