import {
  Connection,
  Connections,
  ethereumProviderPlugin,
} from "@polywrap/ethereum-provider-js";
import { ClientConfigBuilder, IClientConfigBuilder } from "@polywrap/client-config-builder-js";
import { providers } from "@polywrap/test-env-js";
import { DefaultBundle, IWrapPackage } from "@polywrap/client-js";

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
      [DefaultBundle.plugins.ethereumProvider.uri.uri]: ethereumProviderPlugin({
        connections: new Connections({
          networks: {
            testnet: new Connection({ provider: providers.ethereum }),
          }
        }),
      }) as IWrapPackage,
    })

  return builder;
}