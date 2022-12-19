import {
  usePolywrapQuery,
  PolywrapProvider,
  usePolywrapClient,
  createPolywrapProvider,
} from "../../";
// eslint-disable-next-line import/no-extraneous-dependencies
import React from "react";
import { Env, IUriPackage, Uri } from "@polywrap/core-js";

const SimpleStorage = ({ uri }: { uri: string }) => {
  const { execute: deployContract, data: deployData } = usePolywrapQuery<{
    deployContract: string;
  }>({
    uri,
    query: `mutation {
      deployContract(
        connection: {
          networkNameOrChainId: "testnet"
        }
      )
    }`,
  });

  const { execute: setData } = usePolywrapQuery({
    uri,
    query: `mutation {
      setData(
        address: $address
        value: $value
        connection: {
          networkNameOrChainId: "testnet"
        }
      )
    }`,
    variables: {
      value: 5,
      address: deployData?.deployContract,
    },
  });

  const { execute: getStorageData, data: currentStorage } = usePolywrapQuery({
    uri,
    query: `query {
      getData(
        address: "${deployData?.deployContract}"
        connection: {
          networkNameOrChainId: "testnet"
        }
      )
    }`,
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
          <p>SimpleStorage Contract: {deployData.deployContract}</p>
          <button onClick={updateStorageData}>Set the storage to 5!</button>
          <button onClick={() => getStorageData()}>Check storage</button>
          <div>{currentStorage?.getData} </div>
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
