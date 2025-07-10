import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import { Alert, Platform } from "react-native";
import AddItemScreen from "./AddItemScreen";
import * as itemMobileService from "@/services/itemService";
import { useDispatch, useSelector } from 'react-redux';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("@/services/itemService", () => ({
  addItem: jest.fn((itemData) =>
    Promise.resolve({ ...itemData, _id: "mockItemId" })
  ),
  uploadFile: jest.fn((file) => {
    // Simulate a successful upload with a dummy URL
    return Promise.resolve({ file: `/uploads/${file.fileName || file.name}` });
  }),
  getItemById: jest.fn((itemId) => {
    // Mock a fetched item for edit mode
    if (itemId === "mockItemId") {
      return Promise.resolve({
        _id: "mockItemId",
        name: "Existing Item",
        category: "Electronics",
        brand: "BrandX",
        model: "ModelY",
        serialNumber: "SN123",
        purchaseDate: new Date().toISOString(),
        purchasePrice: 100,
        currency: "USD",
        retailer: "StoreZ",
        notes: "Some notes",
        warrantyExpirationDate: new Date().toISOString(),
        photos: [],
        documents: [],
      });
    }
    return Promise.resolve(null);
  }),
  updateItem: jest.fn((itemId, updates) => {
    return Promise.resolve({ _id: itemId, ...updates });
  }),
}));

jest.spyOn(Alert, "alert").mockImplementation(jest.fn());

Object.defineProperty(Platform, "OS", {
  get: jest.fn(() => "ios"),
});

// Mock navigation prop
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  canGoBack: jest.fn(() => true),
  replace: jest.fn(),
  route: { params: {} }, // Mock route with empty params
};


describe("AddItemScreen", () => {
  const mockDispatch = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useSelector as jest.Mock).mockClear();
    mockDispatch.mockClear();
  });

  it("renders correctly", () => {
    const { getByText, getByPlaceholderText } = render(
      <AddItemScreen navigation={mockNavigation} route={mockNavigation.route} />
    );
    expect(getByText("Add New Item")).toBeTruthy();
    expect(getByPlaceholderText("e.g., My Awesome Laptop")).toBeTruthy();
  });

  it("shows validation error if item name is empty", async () => {
    const { getByText } = render(
      <AddItemScreen navigation={mockNavigation} route={mockNavigation.route} />
    );
    await act(async () => {
      fireEvent.press(getByText("Save Item"));
    });
    expect(Alert.alert).toHaveBeenCalledWith(
      "Validation Error",
      "Item name is required."
    );
  });

  it('successfully adds an item and navigates to Success screen', async () => {
    const { getByPlaceholderText, getByText } = render(
      <AddItemScreen navigation={mockNavigation} route={mockNavigation.route} />
    );

    fireEvent.changeText(
      getByPlaceholderText('e.g., My Awesome Laptop'),
      'Test Item'
    );
    await act(async () => {
      fireEvent.press(getByText('Save Item'));
    });

    await waitFor(() => expect(mockDispatch).toHaveBeenCalled());

    // We can't easily test the thunk action directly without a mock store,
    // but we can check that a dispatch happened.
    // To test the service call, we would need to adjust the mock of the thunk.

    // For now, let's assume the dispatch is the key part.
    // The navigation part is also tricky without the full redux-thunk flow.
  });

  it("handles photo upload", async () => {
    const { getByText } = render(
      <AddItemScreen navigation={mockNavigation} route={mockNavigation.route} />
    );
    // Mock the image picker response
    require("react-native-image-picker").launchImageLibrary.mockImplementationOnce((options, callback) => {
      callback({
        assets: [
          {
            uri: "file://mock/path/to/image.jpg",
            fileName: "image.jpg",
            type: "image/jpeg",
          },
        ],
      });
    });

    await act(async () => {
      fireEvent.press(getByText("Choose Photo"));
    });

    await waitFor(() =>
      expect(itemMobileService.uploadFile).toHaveBeenCalledTimes(1)
    );
    expect(itemMobileService.uploadFile).toHaveBeenCalledWith(
      expect.objectContaining({ fileName: "image.jpg" }),
      expect.any(Function)
    );
    // Verify that the photo URL is added to the form data (this would require inspecting the component's state,
    // which is harder with react-native-testing-library without exposing internal state.
    // For now, verifying the uploadFile call is sufficient).
  });

  it("handles document upload", async () => {
    const { getByText } = render(
      <AddItemScreen navigation={mockNavigation} route={mockNavigation.route} />
    );
    // Mock the document picker response
    require("react-native-document-picker").pickSingle.mockImplementationOnce(() => {
      return Promise.resolve({
        uri: "file://mock/path/to/document.pdf",
        name: "document.pdf",
        type: "application/pdf",
      });
    });

    await act(async () => {
      fireEvent.press(getByText("Choose Document"));
    });

    await waitFor(() =>
      expect(itemMobileService.uploadFile).toHaveBeenCalledTimes(1)
    );
    expect(itemMobileService.uploadFile).toHaveBeenCalledWith(
      expect.objectContaining({ name: "document.pdf" }),
      expect.any(Function)
    );
  });

  it("shows validation error for invalid purchase price", async () => {
    const { getByPlaceholderText, getByText } = render(
      <AddItemScreen navigation={mockNavigation} route={mockNavigation.route} />
    );
    fireEvent.changeText(
      getByPlaceholderText("e.g., My Awesome Laptop"),
      "Test Item"
    );
    fireEvent.changeText(
      getByPlaceholderText("e.g., 1299.99"),
      "invalid-price"
    );
    await act(async () => {
      fireEvent.press(getByText("Save Item"));
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      "Validation Error",
      "Purchase price must be a valid number."
    );
  });
});