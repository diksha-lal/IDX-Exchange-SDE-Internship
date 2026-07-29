import { render, screen, fireEvent } from "@testing-library/react";
import PropertyFilters from "./PropertyFilters";

// Test 1: Renders all filter inputs
test("renders all filter inputs and buttons", () => {
  render(<PropertyFilters onSearch={() => {}} />);

  expect(screen.getByPlaceholderText("City")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("ZIP Code")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Min Price")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Max Price")).toBeInTheDocument();
  expect(screen.getByText("Search")).toBeInTheDocument();
  expect(screen.getByText("Clear Filters")).toBeInTheDocument();
});

// Test 2: Calls onSearch with correct values when Search is clicked
test("calls onSearch with filter values when Search is clicked", () => {
  const mockSearch = jest.fn();
  render(<PropertyFilters onSearch={mockSearch} />);

  fireEvent.change(screen.getByPlaceholderText("City"), {
    target: { name: "city", value: "Beverly Hills" },
  });

  fireEvent.click(screen.getByText("Search"));

  expect(mockSearch).toHaveBeenCalledWith(
    expect.objectContaining({ city: "Beverly Hills" })
  );
});

// Test 3: Clear button resets form and calls onSearch with empty object
test("Clear Filters resets form and calls onSearch with empty object", () => {
  const mockSearch = jest.fn();
  render(<PropertyFilters onSearch={mockSearch} />);

  fireEvent.change(screen.getByPlaceholderText("City"), {
    target: { name: "city", value: "Portland" },
  });

  fireEvent.click(screen.getByText("Clear Filters"));

  expect(screen.getByPlaceholderText("City").value).toBe("");
  expect(mockSearch).toHaveBeenCalledWith({});
});