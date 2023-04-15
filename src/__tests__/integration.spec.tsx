import { createPolywrapProvider } from "..";
import { SimpleInvokes } from "./app/SimpleInvokes";

// eslint-disable-next-line import/no-extraneous-dependencies
import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";

jest.setTimeout(360000);

describe("Polywrap React Integration", () => {
  it("SimpleInvokes", async () => {
    render(
      <SimpleInvokes />
    );

    fireEvent.click(screen.getByText("Hash"));
    const hash = /fe74cb04ad93ba10ef51b671778c8327e67a5a728be8c6daa2b4d67d5e43d2e046073a74231182b34414d38ad058beea342fa2e52d977c58de59acdb3a681e04/;
    await waitFor(() => screen.getByText(hash), { timeout: 30000 });
    expect(screen.getByText(hash)).toBeTruthy();

    // check for both clients (custom & default)
    expect(screen.getByText("Client1 Found")).toBeTruthy();
    expect(screen.getByText("Client2 Found")).toBeTruthy();
  });

  it("Should throw error because two providers with same key has been rendered ", () => {
    // @ts-ignore
    const CustomPolywrapProvider = createPolywrapProvider("test");

    expect(() => createPolywrapProvider("test")).toThrowError(
      /A Polywrap provider already exists with the name \"test\"/
    );
  });
});
