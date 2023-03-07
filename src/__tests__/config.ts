import {
  Connection,
  Connections,
  ethereumProviderPlugin,
} from "@polywrap/ethereum-provider-js";
import { ClientConfigBuilder, IClientConfigBuilder, IWrapPackage } from "@polywrap/client-js";
import { providers } from "@polywrap/test-env-js";

export function getClientConfig() {
  const builder = configure(new ClientConfigBuilder())
  builder.build()
  return {
    packages: builder.config.packages,
    envs: builder.config.envs,
    interfaces: builder.config.interfaces
  }
}

export function configure(builder: IClientConfigBuilder): IClientConfigBuilder {
  builder
    .addDefaults()
    .addPackages({
      "wrap://plugin/ethereum-provider@1.1.0": ethereumProviderPlugin({
        connections: new Connections({
          networks: {
            testnet: new Connection({ provider: providers.ethereum }),
          }
        }),
      }) as IWrapPackage
    })
    .addInterfaceImplementation(
      "wrap://ens/wraps.eth:ethereum-provider@1.1.0",
      "wrap://plugin/ethereum-provider@1.1.0"
    )

  return builder;
}