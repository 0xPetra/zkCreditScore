import { useState, useEffect } from 'react'
import { Button, Image, Text, VStack, useBreakpointValue } from "@chakra-ui/react";
import { decode } from '@/lib/wld'
import ContractAbi from '@/abi/Contract.abi'
import { ConnectKitButton } from 'connectkit'
import { IDKitWidget, ISuccessResult } from '@worldcoin/idkit'
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi'

export default function Main() {
	const { address } = useAccount()
	const [isClient, setIsClient] = useState(false);
	const [proof, setProof] = useState<ISuccessResult | null>(null)

	const buttonSize = useBreakpointValue({ base: "sm", md: "md", lg: "lg" });

	const { config } = usePrepareContractWrite({
		address: process.env.NEXT_PUBLIC_CONTRACT_ADDR as `0x${string}`,
		abi: ContractAbi,
		enabled: proof != null && address != null,
		functionName: 'verifyAndExecute',
		args: [
			address!,
			proof?.merkle_root ? decode<bigint>('uint256', proof?.merkle_root ?? '') : BigInt(0),
			proof?.nullifier_hash ? decode<bigint>('uint256', proof?.nullifier_hash ?? '') : BigInt(0),
			proof?.proof
				? decode<[bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint]>(
						'uint256[8]',
						proof?.proof ?? ''
				  )
				: [
						BigInt(0),
						BigInt(0),
						BigInt(0),
						BigInt(0),
						BigInt(0),
						BigInt(0),
						BigInt(0),
						BigInt(0),
				  ],
		],
	})

	const { write } = useContractWrite(config)

	useEffect(() => {
        setIsClient(true);
    }, []);

    return (
		    <VStack
      spacing={4}
      align="center"
      justify="center"
      height="100vh"
    >
      <Image
        src="/heroimage.png" // Replace with your image path
        boxSize={useBreakpointValue({ base: "150px", md: "200px", lg: "250px" })}
        alt="Image Description"
      />
      <Text fontSize={useBreakpointValue({ base: "xl", md: "2xl", lg: "3xl" })} fontWeight="bold">
        zkCreditScore
      </Text>
  
  
  
      <Text fontSize={useBreakpointValue({ base: "md", md: "lg", lg: "xl" })}>
        Connect World ID
      </Text>
      {isClient && address ? (
                proof ? (
                    <Text color="green">
                        World ID Connected
                    </Text>
                    
                ) : (
                    <IDKitWidget
                        signal={address}
                        action="your-action"
                        onSuccess={setProof}
                        app_id={process.env.NEXT_PUBLIC_APP_ID!}
                    >
                        {({ open }) => 
                            <Button size={buttonSize} colorScheme="blue" outline="true" onClick={open}>
                                Verify 
                            </Button>
                        }
                    </IDKitWidget>
                )
            ) : (
                <Button size={buttonSize} colorScheme="blue" outline="true">
                    <ConnectKitButton />
                </Button>
            )}
    </VStack>

    );
};
