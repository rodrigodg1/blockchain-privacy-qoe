// SPDX-License-Identifier: BSD-3-Clause-Clear

pragma solidity ^0.8.24;

interface FhevmLib {
    function verifyCiphertext(
        bytes32 inputHandle,
        address callerAddress,
        address contractAddress,
        bytes memory inputProof,
        bytes1 inputType
    ) external pure returns (uint256 result);
<<<<<<< HEAD
    function cast(uint256 ct, bytes1 toType) external pure returns (uint256 result);
    function trivialEncrypt(uint256 ct, bytes1 toType) external pure returns (uint256 result);
    function fheIfThenElse(uint256 control, uint256 ifTrue, uint256 ifFalse) external pure returns (uint256 result);
    function fheArrayEq(uint256[] memory lhs, uint256[] memory rhs) external pure returns (uint256 result);
    function fheRand(bytes1 randType, uint256 seed) external view returns (uint256 result);
    function fheRandBounded(uint256 upperBound, bytes1 randType, uint256 seed) external view returns (uint256 result);
=======
>>>>>>> c75e191bfd22544bdac8cbbf9df02667721f8631
}
