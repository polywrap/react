import {
  PolywrapProvider,
  usePolywrapClient,
  createPolywrapProvider,
  usePolywrapInvoke,
} from "../../";
// eslint-disable-next-line import/no-extraneous-dependencies
import React from "react";
import { Env, IUriPackage, Uri } from "@polywrap/core-js";

const SimpleStorage = ({ uri }: { uri: string }) => {
  const { execute: deployContract, data: deployData } = usePolywrapInvoke<string>({
    uri,
    method: "deployContract",
    args: {
      connection: {
        networkNameOrChainId: "testnet"
      }
    }
  });

  const { execute: setData } = usePolywrapInvoke({
    uri,
    method: "setData",
    args: {
      address: deployData,
      value: 5,
      connection: {
        networkNameOrChainId: "testnet"
      }
    }
  });

  const { execute: getStorageData, data: currentStorage } = usePolywrapInvoke({
    uri,
    method: "getData",
    args: {
      address: deployData,
      connection: {
        networkNameOrChainId: "testnet"
      }
    }
  });

  const client1 = usePolywrapClient();
  const client2 = usePolywrapClient({ provider: "custom" });

  const updateStorageData = async () => {
    await setData();
    await getStorageData();
  };

  return (
    <>
      {!deployData ? (
        <button onClick={() => deployContract()}>Deploy</button>
      ) : (
        <>
          <p>SimpleStorage Contract: {deployData}</p>
          <button onClick={updateStorageData}>Set the storage to 5!</button>
          <button onClick={() => getStorageData()}>Check storage</button>
          <div>{currentStorage} </div>
          <div>{client1 ? "Client1 Found" : ""}</div>
          <div>{client2 ? "Client2 Found" : ""}</div>
        </>
      )}
    </>
  );
};

const CustomProvider = createPolywrapProvider("custom");

export const SimpleStorageContainer = ({
  envs,
  packages,
  ensUri,
}: {
  envs: Env[];
  packages: IUriPackage<Uri | string>[];
  ensUri: string;
}) => (
  <CustomProvider>
    <PolywrapProvider packages={packages} envs={envs}>
      <SimpleStorage uri={ensUri} />
    </PolywrapProvider>
  </CustomProvider>
);
