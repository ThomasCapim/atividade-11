// Função para criar os elementos HTML necessários na página
function criarInterface() {
    const body = document.body;

    // Criação de um container para os logs de batalha
    const divLogs = document.createElement("div");
    divLogs.id = "logs";
    divLogs.style.fontFamily = "Arial, sans-serif";
    divLogs.style.margin = "20px";
    divLogs.style.padding = "10px";
    divLogs.style.border = "1px solid black";
    divLogs.style.backgroundColor = "#f4f4f4";
    divLogs.style.height = "200px";
    divLogs.style.overflowY = "scroll";
    body.appendChild(divLogs);

    // Criação do botão para avançar os turnos
    const botaoAvancar = document.createElement("button");
    botaoAvancar.id = "botaoAvancar";
    botaoAvancar.innerText = "Avançar Turno";
    botaoAvancar.style.display = "block";
    botaoAvancar.style.marginTop = "20px";
    botaoAvancar.style.padding = "10px 20px";
    botaoAvancar.style.fontSize = "16px";
    botaoAvancar.onclick = avancarTurno;
    body.appendChild(botaoAvancar);
}

// Criando os elementos antes de iniciar o jogo
criarInterface();

// A partir daqui, o código do seu jogo
class Personagem {
    constructor(classe, vida, ataque, defesa) {
        this.nome = classe; // O nome do personagem agora é igual à sua classe
        this.classe = classe;
        this.vida = vida;
        this.ataque = ataque;
        this.defesa = defesa;
        this.vidaOriginal = vida;
    }

    gerarFraseDeEfeito(ataque, oponente) {
        const frases = {
            'Mago': [
                `Mago conjurou uma magia de fogo e causou ${ataque} de dano a ${oponente.nome}!`,
                `Mago lançou uma poderosa magia de gelo e causou ${ataque} de dano a ${oponente.nome}!`,
                `Mago invocou um raio e causou ${ataque} de dano a ${oponente.nome}!`
            ],
            'Guerreiro': [
                `Guerreiro girou violentamente sua espada e causou ${ataque} de dano a ${oponente.nome}!`,
                `Guerreiro desferiu um golpe devastador com sua espada e causou ${ataque} de dano a ${oponente.nome}!`,
                `Guerreiro avançou com seu escudo e espada, causando ${ataque} de dano a ${oponente.nome}!`
            ],
            'Arqueiro': [
                `Arqueiro disparou uma flecha certeira e causou ${ataque} de dano a ${oponente.nome}!`,
                `Arqueiro realizou um tiro duplo e causou ${ataque} de dano a ${oponente.nome}!`,
                `Arqueiro preparou uma flecha envenenada e causou ${ataque} de dano a ${oponente.nome}!`
            ],
            'Samurai': [
                `Samurai desferiu um corte rápido com sua katana, causando ${ataque} de dano a ${oponente.nome}!`,
                `Samurai usou sua técnica mortal e causou ${ataque} de dano a ${oponente.nome}!`,
                `Samurai avançou com sua katana, causando ${ataque} de dano a ${oponente.nome}!`
            ],
            'Paladino': [
                `Paladino brandiu seu martelo sagrado, causando ${ataque} de dano a ${oponente.nome}!`,
                `Paladino invocou a luz divina e causou ${ataque} de dano a ${oponente.nome}!`,
                `Paladino golpeou com força bruta, causando ${ataque} de dano a ${oponente.nome}!`
            ]
        };
        const frasesClasse = frases[this.classe] || [`${this.classe} atacou ${oponente.nome} e causou ${ataque} de dano!`];
        return frasesClasse[Math.floor(Math.random() * frasesClasse.length)];
    }

    atacar(oponente, ataqueAleatorio) {
        const dano = Math.max(1, ataqueAleatorio - oponente.defesa);
        oponente.vida -= dano;
        return this.gerarFraseDeEfeito(dano, oponente);
    }

    resetarVida() {
        this.vida = this.vidaOriginal;
    }
}

class Batalha {
    constructor(personagem1, personagem2) {
        this.personagem1 = personagem1;
        this.personagem2 = personagem2;
        this.logs = [];
        this.turno = 1;
    }

    iniciar() {
        this.adicionarLog(`A batalha entre ${this.personagem1.nome} e ${this.personagem2.nome} começou!`);
        this.atualizarStatus();
    }

    avancar() {
        if (this.personagem1.vida > 0 && this.personagem2.vida > 0) {
            this.adicionarLog(`--- Turno ${this.turno} ---`);
            if (this.turno % 2 === 1) {
                const ataqueAleatorio = Math.floor(Math.random() * this.personagem1.ataque) + 1;
                this.adicionarLog(this.personagem1.atacar(this.personagem2, ataqueAleatorio));
            } else {
                const ataqueAleatorio = Math.floor(Math.random() * this.personagem2.ataque) + 1;
                this.adicionarLog(this.personagem2.atacar(this.personagem1, ataqueAleatorio));
            }
            this.turno++;
            this.atualizarStatus();

            if (this.personagem1.vida <= 0 || this.personagem2.vida <= 0) {
                const vencedor = this.personagem1.vida > 0 ? this.personagem1.nome : this.personagem2.nome;
                this.adicionarLog(`${vencedor} venceu a batalha!`);
                document.getElementById("botaoAvancar").disabled = true;
            }
        }
    }

    adicionarLog(mensagem) {
        this.logs.push(mensagem);
        document.getElementById("logs").innerHTML = this.logs.join('<br>');
    }

    atualizarStatus() {
        const status = `<br>${this.personagem1.nome} - Vida: ${this.personagem1.vida}/${this.personagem1.vidaOriginal}<br>` +
            `${this.personagem2.nome} - Vida: ${this.personagem2.vida}/${this.personagem2.vidaOriginal}<br>`;
        document.getElementById("logs").innerHTML += status;
    }
}

let batalha;

function criarPersonagemAleatorio() {
    const classes = ['Mago', 'Guerreiro', 'Arqueiro', 'Samurai', 'Paladino'];
    const classeEscolhida = classes[Math.floor(Math.random() * classes.length)];
    const vida = Math.floor(Math.random() * 100) + 50;
    const ataque = Math.floor(Math.random() * 20) + 10;
    const defesa = Math.floor(Math.random() * 10) + 5;
    return new Personagem(classeEscolhida, vida, ataque, defesa);
}

function iniciarJogo() {
    const personagem1 = criarPersonagemAleatorio();
    let personagem2 = criarPersonagemAleatorio();

    while (personagem1.classe === personagem2.classe) {
        personagem2 = criarPersonagemAleatorio();
    }

    batalha = new Batalha(personagem1, personagem2);
    batalha.iniciar();

    document.getElementById("botaoAvancar").disabled = false;
}

function avancarTurno() {
    batalha.avancar();
}

// Inicializa o jogo
iniciarJogo();
