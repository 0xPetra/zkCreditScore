import { useState, useEffect } from 'react'
import { Button, Image, Text, VStack, useBreakpointValue, Card, Grid, CardBody } from "@chakra-ui/react";
import { decode } from '@/lib/wld'
import ContractAbi from '@/abi/Contract.abi'
import { ConnectKitButton } from 'connectkit'
import { IDKitWidget, ISuccessResult } from '@worldcoin/idkit'
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi'
import { clientInput } from '../lib/consts'

export default function Main() {
	const { address } = useAccount()
    const [loadingAxiom, setLoadingAxiom] = useState(false)
	const [isClient, setIsClient] = useState(false);
	const [proof, setProof] = useState<ISuccessResult | null>(null)
	const [axiomProof, setAxiomProof] = useState<any | null>(null)

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

    // Handlers
    const generateAxiomProof = async () => {
        try {
            setLoadingAxiom(true);
            const response: any = await fetch(`/api/axiom`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(address)
            });
            console.log("🚀 ~ file: main.tsx:53 ~ generateAxiomProof ~ response:", response)
            setAxiomProof(response.json())
        } catch (error) {
            console.error(error)
        }
        setLoadingAxiom(false);

    }

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

      <Grid templateColumns={{ sm: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }} gap={6} p={6}>
    <Card>
        <CardBody>
            <Text fontSize={useBreakpointValue({ base: "md", md: "lg", lg: "xl" })}>
                World ID
            </Text>
            {isClient && address ? (
                proof ? (
                    <Text color="green">
                        Connected
                    </Text>
                    
                ) : (
                    <IDKitWidget
                        signal={address}
                        action="your-action"
                        onSuccess={setProof}
                        app_id={process.env.NEXT_PUBLIC_APP_ID!}
                    >
                        {({ open }) => 
                            <Button size={buttonSize} variant='outline' colorScheme="red" onClick={open}>
                                Verify World ID 
                            </Button>
                        }
                    </IDKitWidget>
                )
            ) : (
                <Button size={buttonSize} variant='outline' colorScheme="red">
                    <ConnectKitButton />
                </Button>
            )}
        </CardBody>
      </Card>
    <Card>
        <CardBody>
            <Text fontSize={useBreakpointValue({ base: "md", md: "lg", lg: "xl" })}>
                On chain Assets (Axiom)
            </Text> 

            {axiomProof !== null ? 
            <Text color="green">
                Assets: NaN
                {/* Assets: {axiomProof} */}
            </Text>
            :
            <Button size={buttonSize} variant='outline' colorScheme="red" onClick={() => generateAxiomProof()} isLoading={loadingAxiom}>
                Generate Proof
            </Button>}
        </CardBody>
      </Card>
  </Grid>

        {isClient && proof && axiomProof &&
        <Button size={buttonSize} variant='outline' colorScheme="red" onClick={() => generateAxiomProof()} isLoading={loadingAxiom}>
            Generate zk Credit Score
        </Button>
        }
  
  

    </VStack>

    );
};
