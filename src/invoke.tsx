import { usePolywrapClient } from "./client";
import { useStateReducer } from "./state";

import { InvokeOptions, isBuffer, InvokeResult } from "@polywrap/client-js";

export interface UsePolywrapInvokeState<TData = unknown> {
  data?: TData;
  error?: Error;
  loading: boolean;
}

export const INITIAL_INVOKE_STATE: UsePolywrapInvokeState = {
  data: undefined,
  error: undefined,
  loading: false,
};

export interface UsePolywrapInvokeProps extends InvokeOptions {
  provider?: string;
}

/*
Note that the initial values passed into the usePolywrapInvoke hook will be
ignored when an Uint8Array is passed into execute(...).
*/
export interface UsePolywrapInvoke<TData = unknown>
  extends UsePolywrapInvokeState<TData> {
  execute: (
    args?: Record<string, unknown> | Uint8Array
  ) => Promise<InvokeResult<TData>>;
}

export function usePolywrapInvoke<TData = unknown>(
  props: UsePolywrapInvokeProps | InvokeOptions
): UsePolywrapInvoke<TData> {
  const provider = "provider" in props ? props.provider : undefined;
  const client = usePolywrapClient({ provider });

  // Initialize the UsePolywrapInvokeState
  const { state, dispatch } = useStateReducer<UsePolywrapInvokeState<TData>>(
    INITIAL_INVOKE_STATE as UsePolywrapInvokeState<TData>
  );

  const execute = async (args?: Record<string, unknown> | Uint8Array) => {
    dispatch({ loading: true });
    const result = await client.invoke<TData>({
      ...props,
      uri: props.uri.uri,
      args: isBuffer(args)
        ? args
        : {
            ...props.args,
            ...args,
          },
    });
    if (result.ok) {
      dispatch({ data: result.value, loading: false });
    } else {
      dispatch({ error: result.error, loading: false });
    }
    return result;
  };

  return {
    ...state,
    execute,
  };
}
