import { plugin as ensResolverPlugin } from "@polywrap/ens-resolver-plugin-js";
import {
  Connection,
  Connections,
  ethereumProviderPlugin,
} from "@polywrap/ethereum-provider-js";
import { ClientConfigBuilder, defaultIpfsProviders, IClientConfigBuilder } from "@polywrap/client-config-builder-js";
import { ensAddresses, providers } from "@polywrap/test-env-js";

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
      "wrap://ens/wraps.eth:ethereum-provider@1.1.0": ethereumProviderPlugin({
        connections: new Connections({
          networks: {
            testnet: new Connection({ provider: providers.ethereum }),
          }
        }),
      }),
      "wrap://ens/ens-resolver.polywrap.eth": ensResolverPlugin({
        addresses: {
          testnet: ensAddresses.ensAddress
        },
      }),
    })
    .addEnv("wrap://package/ipfs-resolver", {
        provider: providers.ipfs,
        fallbackProviders: defaultIpfsProviders,
      }
    )
    .addInterfaceImplementation(
      "wrap://ens/wraps.eth:ethereum-provider@1.1.0",
      "wrap://ens/wraps.eth:ethereum-provider@1.1.0"
      )

  return builder;
}