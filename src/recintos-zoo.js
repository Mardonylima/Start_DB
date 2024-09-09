class RecintosZoo {
  analisaRecintos(animal, quantidade) {
    // Estrutura de recintos
    const recintos = [
      { numero: 1, bioma: ['savana'], tamanhoTotal: 10, animaisExistentes: [{ especie: 'MACACO', tamanho: 1, quantidade: 3 }], ocupacaoAtual: 3 },
      { numero: 2, bioma: ['floresta'], tamanhoTotal: 5, animaisExistentes: [], ocupacaoAtual: 0 },
      { numero: 3, bioma: ['savana', 'rio'], tamanhoTotal: 7, animaisExistentes: [{ especie: 'GAZELA', tamanho: 2, quantidade: 1 }], ocupacaoAtual: 2 },
      { numero: 4, bioma: ['rio'], tamanhoTotal: 8, animaisExistentes: [], ocupacaoAtual: 0 },
      { numero: 5, bioma: ['savana'], tamanhoTotal: 9, animaisExistentes: [{ especie: 'LEAO', tamanho: 3, quantidade: 1 }], ocupacaoAtual: 3 }
    ];

    // Estrutura de animais
    const animais = {
      LEAO: { tamanho: 3, biomas: ['savana'], carnivoro: true },
      LEOPARDO: { tamanho: 2, biomas: ['savana'], carnivoro: true },
      CROCODILO: { tamanho: 3, biomas: ['rio'], carnivoro: true },
      MACACO: { tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
      GAZELA: { tamanho: 2, biomas: ['savana'], carnivoro: false },
      HIPOPOTAMO: { tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false }
    };

    // Validação do animal
    if (!animais[animal]) {
      return { erro: "Animal inválido", recintosViaveis: null };
    }

    // Validação da quantidade
    if (typeof quantidade !== 'number' || quantidade <= 0) {
      return { erro: "Quantidade inválida", recintosViaveis: null };
    }

    // Dados do animal
    const dadosAnimal = animais[animal];
    const tamanhoAnimal = dadosAnimal.tamanho;
    const biomasAnimal = dadosAnimal.biomas;

    // Lista de recintos viáveis
    let recintosViaveis = [];

    // Verificar cada recinto
    for (const recinto of recintos) {
      // Verificar se o bioma do recinto é adequado
      if (!biomasAnimal.some(bioma => recinto.bioma.includes(bioma))) {
        continue;
      }

      // Verificar se o animal é um crocodilo e o bioma do recinto não é exclusivamente 'rio'
      if (animal === 'CROCODILO' && (recinto.bioma.length !== 1 || !recinto.bioma.includes('rio'))) {
        continue;
      }

      // Verificar se o recinto tem carnívoros e o animal não é da mesma espécie
      const animaisExistentes = recinto.animaisExistentes;
      const temCarnivoros = animaisExistentes.some(a => animais[a.especie.toUpperCase()].carnivoro);
      if (temCarnivoros && dadosAnimal.carnivoro === false) {
        continue; // Não pode colocar herbívoros com carnívoros
      }

      // Calcular espaço livre no recinto
      const espacoOcupado = animaisExistentes.reduce((total, a) => total + a.tamanho * a.quantidade, 0);
      const espacoLivre = recinto.tamanhoTotal - espacoOcupado;
      
      // Calcular espaço necessário
      let espacoNecessario = tamanhoAnimal * quantidade;
      if (quantidade > 1 && recinto.animaisExistentes.length > 0 && !recinto.animaisExistentes.some(a => a.especie === animal)) {
        espacoNecessario += quantidade - 1; // Espaço extra para mais de uma espécie
      }

      // Verificar se há espaço suficiente
      if (espacoLivre >= espacoNecessario) {
        recintosViaveis.push({
          descricao: `Recinto ${recinto.numero} (espaço livre: ${espacoLivre - espacoNecessario} total: ${recinto.tamanhoTotal})`,
          espacoLivre
        });
      }
    }

    // Ordenar recintos viáveis por espaço livre
    recintosViaveis.sort((a, b) => b.espacoLivre - a.espacoLivre); // Maior espaço livre primeiro

    // Retornar recintos viáveis encontrados
    const recintosDescricao = recintosViaveis.map(r => r.descricao);
    if (recintosDescricao.length > 0) {
      return { recintosViaveis: recintosDescricao };
    } else {
      return { erro: "Não há recinto viável", recintosViaveis: null };
    }
  }
}

export { RecintosZoo };
