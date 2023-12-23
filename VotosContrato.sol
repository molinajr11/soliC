// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract VotosContrato {
    // Estructura para representar un voto
    struct Vote {
        string candidateName;
        uint voterId;
    }

    // Mapeo de votos por dirección del votante
    mapping(address => Vote) public votes;

    // Evento emitido al registrar un voto
    event Voted(string candidateName, uint voterId);

    // Función para registrar un voto
    function vote(string memory _candidateName, uint _voterId) public {
        // Verificar si el votante ya ha votado
        require(votes[msg.sender].voterId == 0, "Ya has votado");

        // Registrar el voto
        Vote memory voted = Vote(_candidateName, _voterId);
        votes[msg.sender] = voted;

        // Emitir el evento de voto registrado
        emit Voted(_candidateName, _voterId);
    }

    // Función para obtener el nombre del candidato y la ID del votante
    function getVote() public view returns (string memory candidateName, uint voterId) {
        // Obtener el voto del votante actual
        Vote memory voted = votes[msg.sender];

        // Devolver el nombre del candidato y la ID del votante
        return (voted.candidateName, voted.voterId);
    }
}
