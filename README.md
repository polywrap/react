# @polywrap/react

A React library that simplifies the integration of Polywrap wrappers into React applications. Instantiates the Polywrap Client, send WRAP invocations, and renders the results.

## Documentation
https://docs.polywrap.io/reference/clients/js/libraries/react

## Installation

```bash
npm install @polywrap/react
```

## Usage

### **PolywrapProvider**

Once installed, the first step is to add the `PolywrapProvider` to your DOM. This will instantiate an instance of the `PolywrapClient` for all queries within the nested DOM hierarchy to use.

To use the provider, simply wrap it around whatever DOM hierarchy you'd like to use Polywrap within:

```jsx
import React from 'react';
import { PolywrapProvider } from '@polywrap/react';

export const App: React.FC = () => {
  return (
    <PolywrapProvider>
        <HelloWorld />
    </PolywrapProvider>
  );
};
```

#### **PolywrapProvider Props**

The `PolywrapProvider` component's props are the same as the `PolywrapClient` constructor's arguments. For example, you can configure URI redirects like so:

```jsx
<PolywrapProvider redirects={ [] }/>
```

#### **Multiple PolywrapProviders**

If you need to use multiple providers, you can do so using the `createPolywrapProvider("...")` method, which accepts the name of your provider as an argument. For example:

```jsx
import { createPolywrapProvider } from '@polywrap/react';

const CustomPolywrapProvider = createPolywrapProvider('custom');

export const CustomProvider = ({ children }: { children: JSX.Element }) => {
  return (
    <CustomPolywrapProvider>
      {children}
    </CustomPolywrapProvider>
  );
};
```

### **usePolywrapClient**

You can obtain a copy of the client instance from your `PolywrapProvider` using the `usePolywrapClient` hook.

```jsx
const client = usePolywrapClient();
```

### **usePolywrapInvoke**

After enabling your React application with the PolywrapProvider, you may now use the `usePolywrapInvoke` hook to call into wrappers!

```jsx
const { execute, data, error, loading } = usePolywrapInvoke({
  uri: 'ens/helloworld.polytest.eth',
  method: "logMessage",
  args: {
    message: "Hello World!",
  },
});
```

:::tip
By default, the `usePolywrapInvoke` hook uses the first PolywrapProvider found in the DOM's hierarchy. If you'd like to specify a specific provider to be used, simply set the `provider:` property:

```jsx
const { execute, data, error, loading } = usePolywrapInvoke({
  provider: "custom",
  uri: 'ens/helloworld.polytest.eth',
  method: "logMessage",
  args: {
    message: "Hello World!",
  },
});
```
:::
