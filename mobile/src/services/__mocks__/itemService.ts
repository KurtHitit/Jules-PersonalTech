const mockItems = [
  {
    _id: 'item-1',
    name: 'Laptop',
    category: 'Electronics',
    brand: 'Dell',
    model: 'XPS 15',
    serialNumber: 'SN12345',
    purchaseDate: new Date().toISOString(),
    purchasePrice: 1500,
    currency: 'USD',
    retailer: 'Best Buy',
    notes: 'Work laptop',
    warrantyExpirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    photos: [],
    documents: [],
  },
  {
    _id: 'item-2',
    name: 'Mouse',
    category: 'Electronics',
    brand: 'Logitech',
    model: 'MX Master 3',
    serialNumber: 'SN67890',
    purchaseDate: new Date().toISOString(),
    purchasePrice: 100,
    currency: 'USD',
    retailer: 'Amazon',
    notes: 'Wireless mouse',
    warrantyExpirationDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    photos: [],
    documents: [],
  },
  {
    _id: 'item-3',
    name: 'Keyboard',
    category: 'Electronics',
    brand: 'Keychron',
    model: 'K2',
    serialNumber: 'SN11223',
    purchaseDate: new Date().toISOString(),
    purchasePrice: 120,
    currency: 'USD',
    retailer: 'Keychron',
    notes: 'Mechanical keyboard',
    warrantyExpirationDate: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000).toISOString(),
    photos: [],
    documents: [],
  },
  {
    _id: 'item-4',
    name: 'Monitor',
    category: 'Electronics',
    brand: 'LG',
    model: 'Ultrafine',
    serialNumber: 'SN44556',
    purchaseDate: new Date().toISOString(),
    purchasePrice: 400,
    currency: 'USD',
    retailer: 'Amazon',
    notes: 'External monitor',
    warrantyExpirationDate: new Date(Date.now() + 500 * 24 * 60 * 60 * 1000).toISOString(),
    photos: [],
    documents: [],
  },
];

export const fetchItems = async (searchQuery?: string) => {
  if (!searchQuery) {
    return mockItems;
  }

  const lowerCaseQuery = searchQuery.toLowerCase();
  return mockItems.filter(
    (item) =>
      item.name.toLowerCase().includes(lowerCaseQuery) ||
      item.category.toLowerCase().includes(lowerCaseQuery) ||
      item.brand.toLowerCase().includes(lowerCaseQuery) ||
      item.model.toLowerCase().includes(lowerCaseQuery) ||
      item.notes.toLowerCase().includes(lowerCaseQuery)
  );
};

export const getDiagnosticSuggestions = async () => [];
export const uploadFile = async () => ({ file: 'mock-file-path' });
export const addItem = async (itemData: any) => ({ ...itemData, _id: 'new-mock-item' });
export const getItemById = async (itemId: string) => mockItems.find(item => item._id === itemId) || null;
export const updateItem = async (itemId: string, updates: any) => ({ ...mockItems.find(item => item._id === itemId), ...updates });
export const deleteItem = async () => {};
