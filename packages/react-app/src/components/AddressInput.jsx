import React, { useState, useCallback } from "react";
import { Input, Badge } from "antd";
import { useLookupAddress } from "eth-hooks";
import Blockie from "./Blockie";

export default function AddressInput(props) {
  const [value, setValue] = useState(props.value);

  const currentValue = typeof props.value !== "undefined" ? props.value : value;
  const ens = useLookupAddress(props.ensProvider, currentValue);


  const updateAddress = useCallback(
    async newValue => {
      if (typeof newValue !== "undefined") {
        let address = newValue;
        if (address.indexOf(".eth") > 0 || address.indexOf(".xyz") > 0) {
          try {
            const possibleAddress = await props.ensProvider.resolveName(address);
            if (possibleAddress) {
              address = possibleAddress;
            }
            // eslint-disable-next-line no-empty
          } catch (e) {}
        }
        setValue(address);
        if (typeof props.onChange === "function") {
          props.onChange(address);
        }
      }
    },
    [props.ensProvider, props.onChange],
  );

  return (
    <div>
      <Input
        id={"0xAddress"}//name it something other than address for auto fill doxxing
        name={"0xAddress"}//name it something other than address for auto fill doxxing
        autoFocus={props.autoFocus}
        placeholder={props.placeholder ? props.placeholder : "address"}
        prefix={<Blockie address={currentValue} size={8} scale={3} />}
        value={ens || currentValue}
        onChange={e => {
          updateAddress(e.target.value);
        }}
      />
    </div>
  );
}
