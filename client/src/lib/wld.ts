// import { AbiCoder } from 'ethers'
import { AbiCoder } from 'ethers'


export const decode = <T>(type: string, encodedString: string): T => {
	return AbiCoder.defaultAbiCoder().decode([type], encodedString)[0]
}
