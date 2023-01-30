import { createPolywrapProvider } from "..";
import { SimpleStorageContainer } from "./app/SimpleStorage";
import { createEnvs, createPlugins } from "./config";

import {
  initTestEnvironment,
  stopTestEnvironment,
  buildAndDeployWrapper,
  ensAddresses,
  providers,
} from "@polywrap/test-env-js";
import { Env, IUriPackage, Uri } from "@polywrap/core-js";
import path from "path";

// eslint-disable-next-line import/no-extraneous-dependencies
import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
jest.setTimeout(360000);

describe("Polywrap React Integration", () => {
  let envs: Env[];
  let packages: IUriPackage<Uri | string>[];
  let ensUri: string;
  let wrapper: {
    ensDomain: string;
    ipfsCid: string;
  };

  beforeAll(async () => {
    await initTestEnvironment();

    envs = createEnvs(providers.ipfs);

    packages = createPlugins(ensAddresses.ensAddress, providers.ethereum);

    wrapper = await buildAndDeployWrapper({
      wrapperAbsPath: path.resolve(path.join(__dirname, 'test-cases/simple-storage')),
      ipfsProvider: providers.ipfs,
      ethereumProvider: providers.ethereum,
      codegen: true
    });

    ensUri = `ens/testnet/${wrapper.ensDomain}`;
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  it("Deploys, read and write on Smart Contract ", async () => {
    render(
      <SimpleStorageContainer envs={envs} packages={packages} ensUri={ensUri} />
    );

    fireEvent.click(screen.getByText("Deploy"));
    await waitFor(() => screen.getByText(/0x/), { timeout: 30000 });
    expect(screen.getByText(/0x/)).toBeTruthy();

    // check storage is 0
    fireEvent.click(screen.getByText("Check storage"));
    await waitFor(() => screen.getByText("0"), { timeout: 30000 });
    expect(screen.getByText("0")).toBeTruthy();

    // update storage to five and check it
    fireEvent.click(screen.getByText("Set the storage to 5!"));
    await waitFor(() => screen.getByText("5"), { timeout: 30000 });
    expect(screen.getByText("5")).toBeTruthy();

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
