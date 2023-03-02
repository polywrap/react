import {
  usePolywrapInvoke,
  PolywrapProvider,
  createPolywrapProvider,
} from "..";
import { UsePolywrapInvokeProps } from "../invoke";

import { Uri } from "@polywrap/core-js";
import {
  stopTestEnvironment,
  runCLI,
} from "@polywrap/test-env-js";
import path from "path";

import {
  renderHook,
  act,
  RenderHookOptions,
  cleanup,
} from "@testing-library/react-hooks";
import { getClientConfig } from "./config";
import { BuilderConfig } from "@polywrap/client-js";

jest.setTimeout(360000);

describe("usePolywrapInvoke hook", () => {
  const simpleStoragePath = path.resolve(
    path.join(__dirname, 'test-cases/simple-storage')
  );
  const config = getClientConfig();
  let envs: BuilderConfig["envs"] = config.envs;
  let packages: BuilderConfig["packages"] = config.packages;
  let interfaces: BuilderConfig["interfaces"] = config.interfaces;
  let uri: Uri = Uri.from(`fs/${simpleStoragePath}/build`);
  let WrapperProvider: RenderHookOptions<unknown>;

  beforeAll(async () => {
    await runCLI({
      args: ["infra", "up", "--modules", "eth-ens-ipfs"],
    });

    await runCLI({
      args: ["build"],
      cwd: simpleStoragePath
    });

    WrapperProvider = {
      wrapper: PolywrapProvider,
      initialProps: {
        envs,
        packages,
        interfaces
      },
    };
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  async function executeInvoke<TData>(options: UsePolywrapInvokeProps) {
    const hook = () => usePolywrapInvoke<TData>(options);

    const { result: hookResult } = renderHook(hook, WrapperProvider);

    await act(async () => {
      await hookResult.current.execute();
    });

    const result = hookResult.current;
    cleanup();
    return result;
  }

  async function executeInvokeWithExecVariables<TData>(
    options: UsePolywrapInvokeProps
  ) {
    const hook = () =>
      usePolywrapInvoke<TData>({
        uri: options.uri,
        method: options.method,
        provider: options.provider,
      });

    const { result: hookResult } = renderHook(hook, WrapperProvider);

    await act(async () => {
      await hookResult.current.execute(options.args);
    });

    const result = hookResult.current;
    cleanup();
    return result;
  }

  it("Should update storage data to five", async () => {
    const deployInvoke: UsePolywrapInvokeProps = {
      uri,
      method: "deployContract",
      args: {
        connection: {
          networkNameOrChainId: "testnet",
        },
      },
    };

    const { data: address } = await executeInvoke<string>(deployInvoke);
    const setStorageInvocation: UsePolywrapInvokeProps = {
      uri,
      method: "setData",
      args: {
        address: address,
        value: 5,
        connection: {
          networkNameOrChainId: "testnet",
        },
      },
    };

    const result = await executeInvoke(setStorageInvocation);
    expect(result.error).toBeFalsy();
    expect(result.data).toMatch(/0x/);

    const getStorageDataInvocation: UsePolywrapInvokeProps = {
      uri,
      method: "getData",
      args: {
        address: address,
        connection: {
          networkNameOrChainId: "testnet",
        },
      },
    };

    const { data: getDataData } = await executeInvoke<number>(
      getStorageDataInvocation
    );
    expect(getDataData).toBe(5);
  });

  it("Should throw error because there's no provider with expected key ", async () => {
    const getStorageDataInvocation: UsePolywrapInvokeProps = {
      provider: "Non existent Polywrap Provider",
      uri,
      method: "getData",
      args: {
        address: "foo",
      },
    };

    const getDataStorageHook = () =>
      usePolywrapInvoke(getStorageDataInvocation);
    const { result } = renderHook(getDataStorageHook);

    expect(result.error?.message).toMatch(
      /You are trying to use usePolywrapClient with provider \"Non existent Polywrap Provider\"/
    );
  });

  it("Should throw error if provider is not within the DOM hierarchy", async () => {
    createPolywrapProvider("other");

    const getStorageDataInvocation: UsePolywrapInvokeProps = {
      provider: "other",
      uri,
      method: "getData",
      args: {
        address: "foo",
      },
    };

    const getDataStorageHook = () =>
      usePolywrapInvoke(getStorageDataInvocation);
    const { result } = renderHook(getDataStorageHook, WrapperProvider);

    expect(result.error?.message).toMatch(
      /The requested PolywrapProvider \"other\" was not found within the DOM hierarchy/
    );
  });

  it("Should update storage data to three by setting value through variables passed to exec", async () => {
    const deployInvoke: UsePolywrapInvokeProps = {
      uri,
      method: "deployContract",
      args: {
        connection: {
          networkNameOrChainId: "testnet",
        },
      },
    };

    const { data: address } = await executeInvokeWithExecVariables<string>(
      deployInvoke
    );

    const setStorageInvocation: UsePolywrapInvokeProps = {
      uri,
      method: "setData",
      args: {
        address,
        value: 3,
        connection: {
          networkNameOrChainId: "testnet",
        },
      },
    };

    const result = await executeInvokeWithExecVariables(setStorageInvocation);
    expect(result.error).toBeFalsy();
    expect(result.data).toMatch(/0x/);

    const getStorageDataInvocation: UsePolywrapInvokeProps = {
      uri,
      method: "getData",
      args: {
        address: address,
        connection: {
          networkNameOrChainId: "testnet",
        },
      },
    };

    const { data: getDataData } = await executeInvokeWithExecVariables<number>(
      getStorageDataInvocation
    );
    expect(getDataData).toBe(3);
  });
});
