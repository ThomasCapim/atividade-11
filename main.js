console.log("Olá Mundo!");

// Criando um novo elemento 
let novoElemento = document.createElement('h1');
// Alterando o conteúdo de texto do elemento
novoElemento.innerText = 'Hello, World! English! (Inglês) Ok?!';
// Selecionando o elemento body
let elementoBody = document.body;
// Colocando o novo elemento no body
elementoBody.appendChild(novoElemento);

novoElemento.style.backgroundColor = 'blue';
novoElemento.style.color = 'yellow';

class Personagem {
    constructor(classe, vida, ataque, defesa) {
        this.nome = classe;  // O nome do personagem agora é igual à sua classe
        this.classe = classe;
        this.vida = vida;
        this.ataque = ataque;
        this.defesa = defesa;
        this.vidaOriginal = vida;
    }

    // Frases de efeito específicas para cada classe, escolhidas aleatoriamente
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
        // Ajuste no cálculo do dano para evitar que seja zero
        const dano = Math.max(1, ataqueAleatorio - oponente.defesa);
        oponente.vida -= dano;

        // Retorna a frase de efeito do ataque
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

// Função para criar personagens aleatórios, com nomes de classes iguais
function criarPersonagemAleatorio() {
    const classes = ['Mago', 'Guerreiro', 'Arqueiro', 'Samurai', 'Paladino'];
    const classeEscolhida = classes[Math.floor(Math.random() * classes.length)];
    const vida = Math.floor(Math.random() * 100) + 50;
    const ataque = Math.floor(Math.random() * 20) + 10;
    const defesa = Math.floor(Math.random() * 10) + 5;
    return new Personagem(classeEscolhida, vida, ataque, defesa);
}

// Função que inicializa a batalha
function iniciarJogo() {
    const personagem1 = criarPersonagemAleatorio();
    let personagem2 = criarPersonagemAleatorio();

    // Verificar se as classes são iguais e evitar repetição de nomes
    while (personagem1.classe === personagem2.classe) {
        personagem2 = criarPersonagemAleatorio(); // Evita personagens iguais
    }

    batalha = new Batalha(personagem1, personagem2);
    batalha.iniciar();

    document.getElementById("botaoAvancar").disabled = false;
}

function avancarTurno() {
    batalha.avancar();
}

iniciarJogo();
