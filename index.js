console.clear();
require("dotenv").config();
const {
	AccountId,
	PrivateKey,
	Client,
	FileCreateTransaction,
	ContractCreateTransaction,
	ContractFunctionParameters,
	ContractExecuteTransaction,
	ContractCallQuery,
	Hbar,
	ContractCreateFlow,
} = require("@hashgraph/sdk");
const fs = require("fs")
require("dotenv").config();
    const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
    const operatorKey = PrivateKey.fromString(process.env.OPERATOR_PVKEY);
    // If we weren't able to grab it, we should throw a new error
    if (!operatorId || !operatorKey) {
        throw new Error(
        "Environment variables MY_ACCOUNT_ID and MY_PRIVATE_KEY must be present"
        );
    }
    //Create your Hedera Testnet client
    const client = Client.forTestnet().setOperator(operatorId,operatorKey);
    
    async function main() {
            // Importar el bytecode del contrato
        const contractBytecode = fs.readFileSync("VotingContract_sol_VotingContract.bin");
    
            // Crear una transacción de creación de contrato
        const contractInstantiateTx = new ContractCreateFlow()
		    .setBytecode(contractBytecode)
		    .setGas(100000)
		    .setConstructorParameters(
			    new ContractFunctionParameters().addString("rick").addUint256(11)
		);
    const contractInstantiateSubmit = await contractInstantiateTx.execute(client);
	const contractInstantiateRx = await contractInstantiateSubmit.getReceipt(client);
	const contractId = contractInstantiateRx.contractId;
	const contractAddress = contractId.toSolidityAddress();
	console.log(`- The smart contract ID is: ${contractId} \n`);
	console.log(`- The smart contract ID in Solidity format is: ${contractAddress} \n`);

    	// Query the contract to check changes in state variable
	const contractQueryTx = new ContractCallQuery()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("getVotanteId", new ContractFunctionParameters().addString("rick"));
    const contractQuerySubmit = await contractQueryTx.execute(client);
    const contractQueryResult = contractQuerySubmit.getUint256(0);
    console.log(`- Id Del votante: ${contractQueryResult} \n`);

    // Call contract function to update the state variable
    const contractExecuteTx = new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(100000)
    .setFunction(
        "setVotanteId",
        new ContractFunctionParameters().addString("Estebandido").addUint256(22)
    );
    const contractExecuteSubmit = await contractExecuteTx.execute(client);
    const contractExecuteRx = await contractExecuteSubmit.getReceipt(client);
    console.log(`- Contract function call status: ${contractExecuteRx.status} \n`);
    
    	// Query the contract to check changes in state variable
	const contractQueryTx1 = new ContractCallQuery()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("getVotanteId", new ContractFunctionParameters().addString("Estebandido"));
    const contractQuerySubmit1 = await contractQueryTx1.execute(client);
    const contractQueryResult1 = contractQuerySubmit1.getUint256(0);
    console.log(`- Id votante modificado: ${contractQueryResult1} \n`);
}
main();

// // Import the compiled contract bytecode
    

//   // Crear una transacción de creación de contrato
//   const contractCreateTransaction = new ContractCreateTransaction()
//   .setBytecode(contractBytecode)
//   .setGas(100000)
//   .setConstructorParameters(
//       new ContractFunctionParameters().addString("Esteban").addUint256(1)
//   );
//    // Ejecutar la transacción de creación de contrato
//   const contractCreateResult = await contractCreateTransaction.execute(client);

//     // Obtener el recibo de la transacción
//   const contractCreateReceipt = await contractCreateResult.getReceipt(client);
//   const contractId = contractCreateReceipt.contractId;
//   const contractAddress = contractId.toSolidityAddress();

//   console.log(`- El contrato inteligente se creó con éxito.`);
//   console.log(`- ID del contrato: ${contractId}`);
//   console.log(`- Dirección del contrato en formato Solidity: ${contractAddress}`);

//   // Consultar el contrato para obtener información
//   const contractQueryTx = new ContractCallQuery()
//   .setContractId(contractId)
//   .setGas(100000)
//   .setFunction("getVote");

// const contractQueryResult = await contractQueryTx.execute(client);
// const [candidateName, voterId] = contractQueryResult.getString(0, 1);

// console.log(
//   `- Información actual del contrato: Candidato: ${candidateName}, Cédula: ${voterId}`
// );

// // Ejecutar la función de voto en el contrato
//   const contractVoteTx = new ContractExecuteTransaction()
//   .setContractId(contractId)
//   .setGas(100000)
//   .setFunction(
//   "vote",
//   new ContractFunctionParameters().addString("Bob").addUint256(1234)
//   );

// const contractVoteResult = await contractVoteTx.execute(client);
// const contractVoteReceipt = await contractVoteResult.getReceipt(client);

// console.log(
//   `- Estado de la ejecución de la función de voto: ${contractVoteReceipt.status}`
// );

// // Consultar el contrato después de la actualización
//   const contractQueryResultAfterVote = await contractQueryTx.execute(client);
//   const [candidateNameAfterVote, voterIdAfterVote] = contractQueryResultAfterVote.getString(
//   0,
//   1
//   );

//   console.log(
//   `- Información del contrato después de la actualización: Candidato: ${candidateNameAfterVote}, Cédula: ${voterIdAfterVote}`
//   );
// }