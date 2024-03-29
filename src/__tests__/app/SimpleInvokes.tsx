import { Sys, Uri } from "@polywrap/client-js";
import {
  PolywrapProvider,
  usePolywrapClient,
  createPolywrapProvider,
  usePolywrapInvoke,
} from "../..";

import React from "react";

const CustomProvider = createPolywrapProvider("custom");

function Inner() {
  const { execute, data } = usePolywrapInvoke<string>({
    uri: Uri.from("wrapscan.io/polywrap/sha3@1.0"),
    method: "sha3_512",
    args: {
      message: "Hash This!",
    },
  });

  const client1 = usePolywrapClient();
  const client2 = usePolywrapClient({ provider: "custom" });

  return (
    <>
      {!data ? (
        <button onClick={() => execute()}>Hash</button>
      ) : (
        <div>Hash This: {data}</div>
      )}
      <div>{client1 ? "Client1 Found" : ""}</div>
      <div>{client2 ? "Client2 Found" : ""}</div>
    </>
  );
}

export function SimpleInvokes() {
  return (
    <CustomProvider>
      <PolywrapProvider {...Sys.bundle}>
        <Inner />
      </PolywrapProvider>
    </CustomProvider>
  );
}
