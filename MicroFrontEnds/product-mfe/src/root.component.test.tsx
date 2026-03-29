import { render } from "@testing-library/react";
import Root from "./root.component";

describe("Root component", () => {
  it("should be in the document", () => {
    const { getByText } = render(<Root name="Testapp" />);
    expect(
      getByText(/Fresh groceries for every kitchen, delivered with care\./i)
    ).toBeInTheDocument();
  });
});
