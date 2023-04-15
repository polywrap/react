import { UsePolywrapClientProps } from '../client';
import {
  PolywrapProvider,
  createPolywrapProvider,
  usePolywrapClient
} from "..";

import { renderHook, RenderHookOptions } from "@testing-library/react-hooks";

jest.setTimeout(360000);

describe("usePolywrapClient hook", () => {
  let WrapperProvider: RenderHookOptions<unknown>;

  beforeAll(async () => {
    WrapperProvider = {
      wrapper: PolywrapProvider,
      initialProps: { },
    };
  });

  it("Should throw error because there's no provider with expected key ", async () => {
    const props: UsePolywrapClientProps = {
      provider: "Non existent Polywrap Provider",
    };

    const hook = () => usePolywrapClient(props);

    const { result } = renderHook(hook, WrapperProvider);

    expect(result.error?.message).toMatch(
      /You are trying to use usePolywrapClient with provider \"Non existent Polywrap Provider\"/
    );
  });

  it("Should throw error if provider is not within the DOM hierarchy", async () => {
    createPolywrapProvider("other");

    const props: UsePolywrapClientProps = {
      provider: "other",
    };

    const hook = () => usePolywrapClient(props);

    const { result } = renderHook(hook, WrapperProvider);

    expect(result.error?.message).toMatch(
      /The requested PolywrapProvider \"other\" was not found within the DOM hierarchy/
    );
  });
});
