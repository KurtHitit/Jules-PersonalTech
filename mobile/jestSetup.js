/* global jest */

jest.mock("react-native-image-picker", () => ({
  launchImageLibrary: jest.fn(),
}));

jest.mock("react-native-document-picker", () => ({
  pickSingle: jest.fn(),
  isCancel: jest.fn(() => false), // Mock isCancel function
  types: {
    // Mock DocumentPicker.types
    allFiles: "allFiles",
    images: "images",
    plainText: "plainText",
    audio: "audio",
    pdf: "pdf",
    video: "video",
  },
}));

jest.mock("@react-native-community/datetimepicker", () => ({
  __esModule: true,
  default: "DateTimePicker",
}));
