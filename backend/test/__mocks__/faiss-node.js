const faiss = {
    IndexFlatL2: jest.fn().mockImplementation(() => ({
      add: jest.fn(),
      search: jest.fn().mockReturnValue({ labels: [1, 2, 3] }),
      write: jest.fn(),
      read: jest.fn().mockReturnValue({ labels: [1, 2, 3] }),
      ntotal: jest.fn().mockReturnValue(2)
    })),
  };
  
  module.exports = faiss;
  