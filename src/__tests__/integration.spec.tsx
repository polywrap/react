import { createPolywrapProvider } from "..";
import { SimpleStorageContainer } from "./app/SimpleStorage";

import { runCLI } from "@polywrap/test-env-js";
import path from "path";

// eslint-disable-next-line import/no-extraneous-dependencies
import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { BuilderConfig } from "@polywrap/client-js";
import { getClientConfig } from "./config";
jest.setTimeout(1800000);

describe("Polywrap React Integration", () => {
  const simpleStoragePath = path.resolve(
    path.join(__dirname, 'test-cases/simple-storage')
  );
  const config = getClientConfig();
  let envs: BuilderConfig["envs"] = config.envs;
  let packages: BuilderConfig["packages"] = config.packages;
  let interfaces: BuilderConfig["interfaces"] = config.interfaces;
  let uri: string = `file${simpleStoragePath}/build`;

  beforeAll(async () => {
    await runCLI({
      args: ["infra", "up", "--modules", "eth-ens-ipfs"],
    });

    await runCLI({
      args: ["build"],
      cwd: simpleStoragePath
    });

  });

  afterAll(async () => {
    await runCLI({
      args: ["infra", "down", "--modules", "eth-ens-ipfs"],
    });  
  });

  it("Deploys, read and write on Smart Contract ", async () => {
    render(
      <SimpleStorageContainer envs={envs} packages={packages} interfaces={interfaces} uri={uri} />
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
