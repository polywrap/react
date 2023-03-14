import {
  Connection,
  Connections,
  ethereumProviderPlugin,
} from "@polywrap/ethereum-provider-js";
import { ClientConfigBuilder, IClientConfigBuilder } from "@polywrap/client-config-builder-js";
import { providers } from "@polywrap/test-env-js";
import { IWrapPackage } from "@polywrap/client-js";

export function getClientConfig() {
  const builder = configure(new ClientConfigBuilder())
  builder.build()
  return {
    packages: builder.config.packages,
    envs: builder.config.envs,
    interfaces: builder.config.interfaces,
    redirects: builder.config.redirects,
    resolvers: builder.config.resolvers,
    wrappers: builder.config.wrappers
  }
}

export function configure(builder: IClientConfigBuilder): IClientConfigBuilder {
  builder
    .addDefaults()
    .addPackages({
      "wrap://ens/wraps.eth:ethereum-provider@1.1.0": ethereumProviderPlugin({
        connections: new Connections({
          networks: {
            testnet: new Connection({ provider: providers.ethereum }),
          }
        }),
      }) as IWrapPackage,
    })
    .addInterfaceImplementation(
      "wrap://ens/wraps.eth:ethereum-provider@1.1.0",
      "wrap://ens/wraps.eth:ethereum-provider@1.1.0"
      )

  return builder;
}