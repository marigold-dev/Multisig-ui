import { AccountInfo } from "@airgap/beacon-sdk";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { TezosToolkit } from "@taquito/taquito";
import { Context, createContext, Dispatch, useReducer } from "react";
type contractStorage = {
  proposal_counter: string, 
  balance: string, 
  proposal_map: string,
  signers: string[],
  threshold: number
}
type tezosState = {
  connection: TezosToolkit;
  beaconWallet: BeaconWallet | null;
  address: string | null;
  balance: string | null;
  accountInfo: AccountInfo | null;
  contracts: { [address: string]: contractStorage };
  aliases: { [address: string]: string };
};
type storage = {
  contracts: { [address: string]: contractStorage };
  aliases: { [address: string]: string };
};

let emptyState = {
  beaconWallet: null,
  contracts: {},
  aliases: {},
  balance: null,
  address: null,
  accountInfo: null,
  connection: new TezosToolkit("https://ghostnet.ecadinfra.com"),
};

type action =
  | { type: "beaconConnect"; payload: BeaconWallet }
  | { type: "init"; payload: tezosState }
  | {
      type: "login";
      accountInfo: AccountInfo;
      address: string;
      balance: string;
    }
  | { type: "addContract", payload: {aliases: {[address: string]: string}, address: string, contract: contractStorage }}
  | { type: "removeContract", address: string}
  | { type: "logout" }
  | { type: "loadStorage"; payload: storage }
  | { type: "writeStorage"; payload: storage };

function reducer(state: tezosState, action: action): tezosState {
  switch (action.type) {
    case "beaconConnect": {
        state.connection.setWalletProvider(action.payload);
        return {...state, beaconWallet: action.payload}
    }
    case "addContract": {
      let al = action.payload.aliases;
      let aliases = {...state.aliases,...al };
      let contracts = {...state.contracts, [action.payload.address]: action.payload.contract}
      localStorage.setItem("app_state", JSON.stringify({contracts, aliases}))
      return {
        ...state, contracts: contracts, aliases: aliases
      }
    }
    case "init": {
      return {
        ...action.payload,
      };
    }
    case "login": {
      return {
        ...state,
        balance: action.balance,
        accountInfo: action.accountInfo,
        address: action.address,
      };
    }
    case "logout": {
      return {
        ...state,
        beaconWallet: null,
        balance: null,
        accountInfo: null,
        address: null,
        connection: new TezosToolkit("https://ghostnet.ecadinfra.com"),
      };
    }
    default: {
      throw "notImplemented";
    }
  }
}
function init(): tezosState {
      
  let rawStorage = window!.localStorage.getItem("app_state")!;
  let storage: storage = JSON.parse(rawStorage);
  return {
    ...emptyState,
    ...storage
    };
}
let AppStateContext: Context<tezosState | null> = createContext<tezosState | null>(null);
let AppDispatchContext: Context<Dispatch<action> | null> = createContext<Dispatch<action> | null>(null);
export {
  type tezosState,
  type action,
  init,
  AppStateContext,
  AppDispatchContext,
  emptyState,
  reducer
};