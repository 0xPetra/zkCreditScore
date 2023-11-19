import { useState, useEffect } from 'react'
import { Button, Image, Text, VStack, useBreakpointValue, Card, Grid, CardBody, Box } from "@chakra-ui/react";
import { decode } from '@/lib/wld'
import ContractAbi from '@/abi/Contract.abi'
import hub from '@ezkljs/hub'
import { ConnectKitButton } from 'connectkit'
import { IDKitWidget, ISuccessResult } from '@worldcoin/idkit'
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi'

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
        <Box>

    <VStack
      spacing={4}
      align="center"
      justify="center"
    >
      <Text fontSize={useBreakpointValue({ base: "xl", md: "2xl", lg: "3xl" })} fontWeight="bold">
            zkCreditScore
      </Text>
      <Image
        src="/confused-john-travolta.gif" // Replace with your image path
        boxSize={useBreakpointValue({ base: "150px", md: "200px", lg: "250px" })}
        alt="Image Description"
      />
      <Text fontSize={useBreakpointValue({ base: "xl", md: "2xl", lg: "3xl" })} fontWeight="bold" color="blue">
        Where is the collateral?
      </Text>
      <Text fontSize={useBreakpointValue({ base: "lg", md: "md", lg: "md" })} fontWeight="bold">
        Minimized collateral lending protocol
      </Text>

      <Grid templateColumns={{ sm: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }} gap={6} p={6}>
    <Card>
        <CardBody>
            <Text fontSize={useBreakpointValue({ base: "md", md: "lg", lg: "xl" })}>
                World ID
            </Text>
            {isClient && address ? (
                proof ? (
                    <Text color="green">
                        Connected
                        <br />
                        {address}
                    </Text>
                    
                ) : (
                    <IDKitWidget
                        signal={address}
                        action="your-action"
                        onSuccess={setProof}
                        app_id={process.env.NEXT_PUBLIC_APP_ID!}
                    >
                        {({ open }) => 
                            <Button size={buttonSize} variant='outline' colorScheme="blue" onClick={open}>
                                Verify World ID 
                            </Button>
                        }
                    </IDKitWidget>
                )
            ) : (
                <Button size={buttonSize} variant='outline' colorScheme="blue">
                    <ConnectKitButton />
                </Button>
            )}
        </CardBody>
      </Card>
    <Card>
        <CardBody>
            <Text fontSize={useBreakpointValue({ base: "md", md: "lg", lg: "xl" })}>
                Base KYC
            </Text> 

            <Text color="gray">
                (coming soon)
            </Text>
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
            <Button size={buttonSize} variant='outline' colorScheme="blue" onClick={() => generateAxiomProof()} isLoading={loadingAxiom}>
                Generate Proof
            </Button>}
        </CardBody>
      </Card>
   <Card>
        <CardBody>
            <Text fontSize={useBreakpointValue({ base: "md", md: "lg", lg: "xl" })}>
                Off chain credit score
            </Text> 

            <Text color="gray">
                (coming soon)
            </Text>
        </CardBody>
      </Card>

  </Grid>

        {isClient && proof && axiomProof &&
        <Box>
            <Text fontSize="xl">
                Generate zk Credit Score
            </Text> 
            <Button size={buttonSize} variant='outline' colorScheme="red" onClick={() => generateAxiomProof()} isLoading={loadingAxiom}>
                Generate zk Credit Score
            </Button>
        </Box>
        }


    <Grid templateColumns={{ sm: "repeat(1, 1fr)", md: "repeat(6, 1fr)" }} gap={2}>
        <Image
        src="/girl.png" // Replace with your image path
        boxSize={useBreakpointValue({ base: "50px", md: "100px", lg: "150px" })}
        alt="Nounish girl"
      />
        <Image
        src="/girl.png" // Replace with your image path
        boxSize={useBreakpointValue({ base: "50px", md: "100px", lg: "150px" })}
        alt="Nounish girl"
      />
        <Image
        src="/girl.png" // Replace with your image path
        boxSize={useBreakpointValue({ base: "50px", md: "100px", lg: "150px" })}
        alt="Nounish girl"
      />
        <Image
        src="/girl.png" // Replace with your image path
        boxSize={useBreakpointValue({ base: "50px", md: "100px", lg: "150px" })}
        alt="Nounish girl"
      />
        <Image
        src="/girl.png" // Replace with your image path
        boxSize={useBreakpointValue({ base: "50px", md: "100px", lg: "150px" })}
        alt="Nounish girl"
      />
        <Image
        src="/girl.png" // Replace with your image path
        boxSize={useBreakpointValue({ base: "50px", md: "100px", lg: "150px" })}
        alt="Nounish girl"
      />
    </Grid>

    </VStack>
    
    </Box>


    );
};
