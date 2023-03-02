import { UsePolywrapClientProps } from '../client';
import {
  PolywrapProvider,
  createPolywrapProvider,
  usePolywrapClient
} from "..";
import { getClientConfig } from "./config";

import {
  runCLI,
} from "@polywrap/test-env-js";
import { renderHook, RenderHookOptions } from "@testing-library/react-hooks";
import { BuilderConfig } from '@polywrap/client-js';

jest.setTimeout(360000);

describe("usePolywrapClient hook", () => {
  const config = getClientConfig();
  let envs: BuilderConfig["envs"] = config.envs;
  let packages: BuilderConfig["packages"] = config.packages;
  let WrapperProvider: RenderHookOptions<unknown>;

  beforeAll(async () => {
    await runCLI({
      args: ["infra", "up", "--modules", "eth-ens-ipfs"],
    });

    WrapperProvider = {
      wrapper: PolywrapProvider,
      initialProps: {
        envs,
        packages,
      },
    };
  });

  afterAll(async () => {
    await runCLI({
      args: ["infra", "down", "--modules", "eth-ens-ipfs"],
    }); 
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
