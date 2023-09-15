/* eslint-disable @typescript-eslint/naming-convention */

import React from "react";
import {
  BuilderConfig,
  PolywrapClientConfigBuilder,
  PolywrapClient,
} from "@polywrap/client-js";

type ClientContext = React.Context<PolywrapClient>;

interface PolywrapProviderState {
  ClientContext: ClientContext;
  client?: PolywrapClient;
}

interface PolywrapProviderMap {
  [name: string]: PolywrapProviderState;
}

export const PROVIDERS: PolywrapProviderMap = {};

type PolywrapProviderProps = Partial<BuilderConfig>;

export type PolywrapProviderFC = React.FC<PolywrapProviderProps>;

export function createPolywrapProvider(name: string): PolywrapProviderFC {
  // Make sure the provider isn't already set
  if (PROVIDERS[name]) {
    throw new Error(
      `A Polywrap provider already exists with the name "${name}"`
    );
  }

  // Reserve the provider slot
  PROVIDERS[name] = {
    ClientContext: React.createContext({} as PolywrapClient),
  };

  return ({ children, ...config }) => {
    const [clientCreated, setClientCreated] = React.useState(false);

    React.useEffect(() => {
      // If the client has already been set for this provider
      if (PROVIDERS[name].client) {
        throw Error(
          `Duplicate PolywrapProvider detected. Please use "createPolywrapProvider("provider-name")".`
        );
      }

      const config = new PolywrapClientConfigBuilder().addBundle("sys").build();
      PROVIDERS[name].client = new PolywrapClient(config);

      setClientCreated(true);

      // Unset the client in the global state when
      // this provider is unmounted
      return function cleanup() {
        PROVIDERS[name].client = undefined;
      };
    });

    // Get the provider's context
    const ClientProvider = PROVIDERS[name].ClientContext.Provider;

    return clientCreated ? (
      <ClientProvider value={PROVIDERS[name].client as PolywrapClient}>
        {children}
      </ClientProvider>
    ) : null;
  };
}

export const PRIMARY_PROVIDER = "PRIMARY_PROVIDER";

export const PolywrapProvider = createPolywrapProvider(PRIMARY_PROVIDER);
