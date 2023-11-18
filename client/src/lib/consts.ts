import { ethers } from "ethers";

export const APP_NAME = "zk Credit Score";

  // The following part creates a ZK proof from a variable input and builds the query for you to send on-chain.
  // We'll just do an example input here:
  export const clientInput = {
    blockNumber: 10051661,
    // To find the slot of a mapping, use the following command:
    // $ forge inspect <contract> storage-layout --pretty
    mappingSlot: ethers.toBeHex(300), // slot 300 of AxiomV2Query is `mapping(uint256 => AxiomQueryMetadata) public queries`
    queryId:
      66966676587627506390515603527468953886054461497745819784183473907733311885447n,
    offset: 1, // offset 1 should be the `payment` field in `AxiomQueryMetadata`
  };