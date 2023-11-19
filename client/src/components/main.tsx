import { useState, useEffect } from 'react'
import { Button, Image, Text, VStack, useBreakpointValue, Card, Grid, CardBody, Box, Spinner, Link } from "@chakra-ui/react";
import { decode } from '@/lib/wld'
import ContractAbi from '@/abi/Contract.abi'
import hub from '@ezkljs/hub'
import { ConnectKitButton } from 'connectkit'
import { IDKitWidget, ISuccessResult } from '@worldcoin/idkit'
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi'
import { ExternalLinkIcon } from '@chakra-ui/icons'

export default function Main() {
	const { address } = useAccount()

    // Loading states
    const [loadingAxiom, setLoadingAxiom] = useState<boolean>(false)
	const [loadingEZKL, setLoadingEZKL] = useState<boolean>(false)
	const [printingMagicMoney, setPrintingMagicMoney] = useState<boolean>(false)

	const [isClient, setIsClient] = useState(false);
	const [proof, setProof] = useState<ISuccessResult | null>(null)
	const [axiomResponse, setAxiomResponse] = useState<any | null>(null)
	const [creditScore, setCreditScore] = useState<any | null>(null)

	const buttonSize = useBreakpointValue({ base: "sm", md: "md", lg: "lg" });
    const breakpoint = useBreakpointValue({ base: "xl", md: "2xl", lg: "3xl" })

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

            const axiomUrl = await response.json()
            const transaction = axiomUrl.data.transaction;
            setAxiomResponse(transaction);
        } catch (error) {
            console.error(error)
        }
        setLoadingAxiom(false);
    }

    const generateCreditScore = async () => {
        try {
            setLoadingEZKL(true)
            const id: string = 'c4b049c3-9770-45cf-b8ec-1bee0efc8347' // uuid
            // you can provide an optional url if you're using a custom EZKL Hub instance
            const url: string = 'https://hub.ezkl.xyz'
            const getProofResponse = await hub.getProof({ id, url })
            console.log("🚀 ~ file: main.tsx:88 ~ generateCreditScore ~ getProofResponse:", getProofResponse)
            console.log(JSON.stringify(getProofResponse), null, 2)
            setCreditScore(8.7)
        } catch (error) {
            console.error(error)
        }
        setLoadingEZKL(false)
    }

    const getLoan = () => {
        setPrintingMagicMoney(true);
    }

    return (
        <>
            <Text fontWeight="bold" margin={2}>
            {isClient && address && `🐶 ${address.slice(0, 5)}...${address.slice(-5)}`}
            </Text>
        <Box margin={100}>
        <VStack
            spacing={4}
            align="center"
            justify="center"
        >
        <Image
            src="/dog.png" // Replace with your image path
            boxSize='250px'
            alt="Image Description"
        />
      <Text fontSize={useBreakpointValue({ base: "xl", md: "2xl", lg: "3xl" })} fontWeight="bold">
        Defi&apos;s Original Goal
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
                <ConnectKitButton />
            )}
        </CardBody>
      </Card>

      <Card>
        <CardBody>
            <Text fontSize={useBreakpointValue({ base: "md", md: "lg", lg: "xl" })}>
                On chain Assets (Axiom)
            </Text> 

            {axiomResponse !== null ? 
            <Link href={axiomResponse} isExternal>
              Axiom Proof <ExternalLinkIcon mx='2px' />
            </Link>
            :
            <Button size={buttonSize} variant='outline' colorScheme="blue" onClick={() => generateAxiomProof()} isLoading={loadingAxiom}>
                Generate Proof
            </Button>}
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
                Off chain credit score
            </Text>
            <Text color="gray">
                (coming soon)
            </Text>
        </CardBody>
      </Card>

    </Grid>
        {true &&
        // {/* FIXME: */}
        // {isClient && proof && axiomProof && !creditScore &&
            <Box>
            <Text fontSize="xl">
            ZKML Credit Score
            </Text> 
            <Button size={buttonSize} variant='outline' colorScheme="blue" onClick={() => generateCreditScore()} isLoading={loadingEZKL}>
            Generate
            </Button>
            </Box>
        }
        {creditScore && 
            <Box>
            <Text fontSize="xl">
                Get Loan
            </Text> 
            <Button size={buttonSize} variant='outline' colorScheme="blue" onClick={() => getLoan()} isLoading={loadingEZKL}>
                Send it!
            </Button>
            </Box>
        }

        {printingMagicMoney ?
            <>
            <Box>
            <Image
                src="/magicmoney.gif" // Replace with your image path
                boxSize='250px'
                alt="Image Description"
            />
            <Text fontSize="xl" color="green">
                Generating loan
                <Spinner />
            </Text> 
            </Box>
        </>
        :
        <>
      <Image
        src="/confused-john-travolta.gif" // Replace with your image path
        boxSize='250px'
        alt="John Travolta confused"
        />
      <Text fontSize={breakpoint} fontWeight="bold" color="blue">
        Where is the collateral?
      </Text>
        </>
    }


    {/* <Grid templateColumns={{ sm: "repeat(1, 1fr)", md: "repeat(6, 1fr)" }} gap={2}>
        <Image
        src="/girl.png" // Replace with your image path
        boxSize={useBreakpointValue({ base: "50px", md: "100px", lg: "150px" })}
        alt="Nounish girl"
      />
        <Image
        src="/monkey.png" // Replace with your image path
        boxSize={useBreakpointValue({ base: "50px", md: "100px", lg: "150px" })}
        alt="Nounish girl"
      />
        <Image
        src="/girl.png" // Replace with your image path
        boxSize={useBreakpointValue({ base: "50px", md: "100px", lg: "150px" })}
        alt="Nounish girl"
      />
        <Image
        src="/monkey.png" // Replace with your image path
        boxSize={useBreakpointValue({ base: "50px", md: "100px", lg: "150px" })}
        alt="Nounish girl"
      />
        <Image
        src="/girl.png" // Replace with your image path
        boxSize={useBreakpointValue({ base: "50px", md: "100px", lg: "150px" })}
        alt="Nounish girl"
      />
        <Image
        src="/monkey.png" // Replace with your image path
        boxSize={useBreakpointValue({ base: "50px", md: "100px", lg: "150px" })}
        alt="Nounish girl"
      />
    </Grid> */}

    </VStack>
    
    </Box>
    </>


    );
};
