export interface BibleVerse {
  id: number;
  text: string;
  reference: string;
  book: string;
  chapter: number;
  verse: number;
  category?: string;
}

export const versesDatabase: BibleVerse[] = [
  { id: 1, text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.", reference: "João 3:16", book: "João", chapter: 3, verse: 16, category: "amor" },
  { id: 2, text: "O Senhor é o meu pastor; nada me faltará.", reference: "Salmos 23:1", book: "Salmos", chapter: 23, verse: 1, category: "conforto" },
  { id: 3, text: "Tudo posso naquele que me fortalece.", reference: "Filipenses 4:13", book: "Filipenses", chapter: 4, verse: 13, category: "força" },
  { id: 4, text: "Lançando sobre ele toda a vossa ansiedade, porque ele tem cuidado de vós.", reference: "1 Pedro 5:7", book: "1 Pedro", chapter: 5, verse: 7, category: "ansiedade" },
  { id: 5, text: "Entrega o teu caminho ao Senhor; confia nele, e ele o fará.", reference: "Salmos 37:5", book: "Salmos", chapter: 37, verse: 5, category: "confiança" },
  { id: 6, text: "E sabemos que todas as coisas contribuem juntamente para o bem daqueles que amam a Deus.", reference: "Romanos 8:28", book: "Romanos", chapter: 8, verse: 28, category: "esperança" },
  { id: 7, text: "Não temas, porque eu sou contigo; não te assombres, porque eu sou teu Deus.", reference: "Isaías 41:10", book: "Isaías", chapter: 41, verse: 10, category: "medo" },
  { id: 8, text: "A alegria do Senhor é a vossa força.", reference: "Neemias 8:10", book: "Neemias", chapter: 8, verse: 10, category: "alegria" },
  { id: 9, text: "Buscar-me-eis, e me achareis, quando me buscardes de todo o vosso coração.", reference: "Jeremias 29:13", book: "Jeremias", chapter: 29, verse: 13, category: "busca" },
  { id: 10, text: "Em paz também me deitarei e dormirei, porque só tu, Senhor, me fazes habitar em segurança.", reference: "Salmos 4:8", book: "Salmos", chapter: 4, verse: 8, category: "paz" },
  { id: 11, text: "Aquietai-vos, e sabei que eu sou Deus.", reference: "Salmos 46:10", book: "Salmos", chapter: 46, verse: 10, category: "paz" },
  { id: 12, text: "Fiel é o Senhor, que vos confirmará e guardará do maligno.", reference: "2 Tessalonicenses 3:3", book: "2 Tessalonicenses", chapter: 3, verse: 3, category: "proteção" },
  { id: 13, text: "Em tudo dai graças, porque esta é a vontade de Deus em Cristo Jesus para convosco.", reference: "1 Tessalonicenses 5:18", book: "1 Tessalonicenses", chapter: 5, verse: 18, category: "gratidão" },
  { id: 14, text: "O amor é paciente, o amor é bondoso.", reference: "1 Coríntios 13:4", book: "1 Coríntios", chapter: 13, verse: 4, category: "amor" },
  { id: 15, text: "Bem-aventurados os que têm fome e sede de justiça, porque eles serão fartos.", reference: "Mateus 5:6", book: "Mateus", chapter: 5, verse: 6, category: "justiça" },
  { id: 16, text: "Perto está o Senhor dos que têm o coração quebrantado.", reference: "Salmos 34:18", book: "Salmos", chapter: 34, verse: 18, category: "tristeza" },
  { id: 17, text: "A tua palavra é lâmpada para os meus pés e luz para o meu caminho.", reference: "Salmos 119:105", book: "Salmos", chapter: 119, verse: 105, category: "direção" },
  { id: 18, text: "Porque eu sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz.", reference: "Jeremias 29:11", book: "Jeremias", chapter: 29, verse: 11, category: "esperança" },
  { id: 19, text: "Se Deus é por nós, quem será contra nós?", reference: "Romanos 8:31", book: "Romanos", chapter: 8, verse: 31, category: "vitória" },
  { id: 20, text: "Porque onde estiver o vosso tesouro, aí estará também o vosso coração.", reference: "Mateus 6:21", book: "Mateus", chapter: 6, verse: 21, category: "prioridades" },
  { id: 21, text: "Ó provai, e vede que o Senhor é bom; bem-aventurado o homem que nele confia.", reference: "Salmos 34:8", book: "Salmos", chapter: 34, verse: 8, category: "confiança" },
  { id: 22, text: "E a paz de Deus, que excede todo o entendimento, guardará os vossos corações e os vossos sentimentos.", reference: "Filipenses 4:7", book: "Filipenses", chapter: 4, verse: 7, category: "paz" },
  { id: 23, text: "Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.", reference: "Mateus 11:28", book: "Mateus", chapter: 11, verse: 28, category: "descanso" },
  { id: 24, text: "Posso todas as coisas em Cristo que me fortalece.", reference: "Filipenses 4:13", book: "Filipenses", chapter: 4, verse: 13, category: "força" },
  { id: 25, text: "Portanto não vos inquieteis com o dia de amanhã.", reference: "Mateus 6:34", book: "Mateus", chapter: 6, verse: 34, category: "ansiedade" },
  { id: 26, text: "O Senhor é a minha luz e a minha salvação; a quem temerei?", reference: "Salmos 27:1", book: "Salmos", chapter: 27, verse: 1, category: "coragem" },
  { id: 27, text: "O meu Deus, segundo as suas riquezas, suprirá todas as vossas necessidades.", reference: "Filipenses 4:19", book: "Filipenses", chapter: 4, verse: 19, category: "provisão" },
  { id: 28, text: "Confiai no Senhor perpetuamente; porque o Senhor Deus é uma rocha eterna.", reference: "Isaías 26:4", book: "Isaías", chapter: 26, verse: 4, category: "confiança" },
  { id: 29, text: "Porque sou eu que conheço os planos que tenho para vocês, diz o Senhor.", reference: "Jeremias 29:11", book: "Jeremias", chapter: 29, verse: 11, category: "futuro" },
  { id: 30, text: "Alegrai-vos sempre no Senhor; outra vez digo, alegrai-vos.", reference: "Filipenses 4:4", book: "Filipenses", chapter: 4, verse: 4, category: "alegria" }
];

export function getTodayVerse(): BibleVerse {
  const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  const index = dayOfYear % versesDatabase.length;
  return versesDatabase[index];
}

export function getVerseById(id: number): BibleVerse | undefined {
  return versesDatabase.find(v => v.id === id);
}

export function getVersesByCategory(category: string): BibleVerse[] {
  return versesDatabase.filter(v => v.category === category);
}

export function searchVerses(query: string): BibleVerse[] {
  const lowerQuery = query.toLowerCase();
  return versesDatabase.filter(v => 
    v.text.toLowerCase().includes(lowerQuery) ||
    v.reference.toLowerCase().includes(lowerQuery) ||
    v.book.toLowerCase().includes(lowerQuery)
  );
}
