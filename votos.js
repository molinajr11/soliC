console.clear();
require("dotenv").config();
const {
    AccountId,
    PrivateKey,
    Client,
    ContractFunctionParameters,
    ContractExecuteTransaction,
    ContractCallQuery,
    Hbar,
    ContractCreateFlow,
} = require("@hashgraph/sdk");
const fs = require("fs");

const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromString(process.env.OPERATOR_PVKEY);

if (!operatorId || !operatorKey) {
    throw new Error(
        "Environment variables OPERATOR_ID and OPERATOR_PVKEY must be present"
    );
}

const client = Client.forTestnet().setOperator(operatorId, operatorKey);

async function main() {
    // Importar el bytecode del contrato
    const contractBytecode = fs.readFileSync("VotosContrato_sol_VotosContrato.bin");

    // Crear una transacción de creación de contrato
    const contractCreateTransaction = new ContractCreateFlow()
        .setBytecode(contractBytecode)
        .setGas(100000)
        .setConstructorParameters(
            new ContractFunctionParameters().addString("rick").addUint256(11)
        );

    const contractCreateResult = await contractCreateTransaction.execute(client);
    const contractCreateReceipt = await contractCreateResult.getReceipt(client);
    const contractId = contractCreateReceipt.contractId;
    const contractAddress = contractId.toSolidityAddress();
    console.log(`- The smart contract ID is: ${contractId}\n`);
    console.log(`- The smart contract ID in Solidity format is: ${contractAddress}\n`);

    // Consultar el contrato para obtener información antes de la actualización
    const contractQueryTx = new ContractCallQuery()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("getVote");
    const contractVoteTx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction(
            "vote",
            new ContractFunctionParameters().addString("Juan esteban").addUint256(11)
        );
    const contractQuerySubmit= await contractVoteTx.execute(client);
    const contractVoteReceipt = await contractQuerySubmit.getReceipt(client);
    console.log(`- votoGenerado: ${JSON.stringify(contractQuerySubmit)} \n`)
    console.log(`- Estado de la ejecución de la función de voto: ${contractVoteReceipt.status} \n`);
    
    // Obtener el nombre del candidato y el ID del votante después de la actualización
    const contractQueryTxAfterVote = new ContractCallQuery()
        .setContractId(contractId)
        .setGas(100000)
    .setFunction("getVote");
    const [candidateName, votanteId] = await getContractInfo(contractQueryTxAfterVote);
    console.log(`- Información del contrato : Candidato: ${candidateName}, Id: ${votanteId}\n`
);

// Función para obtener información del contrato
async function getContractInfo(queryTransaction) {
    const contractQueryResult = await queryTransaction.execute(client);
    const candidateName = contractQueryResult.getString(0);
    const votanteId= contractQueryResult.getUint256(1);
    return [candidateName,votanteId];
    }
}

main();
