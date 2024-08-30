// SPDX-License-Identifier: BSD-3-Clause-Clear

pragma solidity ^0.8.24;

import "../lib/TFHE.sol";

contract Counter {
  euint32 counter;

  function add(einput valueInput, bytes calldata inputProof) public {
    euint32 value = TFHE.asEuint32(valueInput, inputProof);
    counter = TFHE.add(counter, value);
    TFHE.allow(counter, address(this));
  }
}