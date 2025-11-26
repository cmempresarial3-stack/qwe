// Banco completo de versos bíblicos para o Verso do Dia
export const dailyVerses = [
  { text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.", reference: "João 3:16" },
  { text: "Posso todas as coisas em Cristo que me fortalece.", reference: "Filipenses 4:13" },
  { text: "Tudo tem o seu tempo determinado, e há tempo para todo o propósito debaixo do céu.", reference: "Eclesiastes 3:1" },
  { text: "Confie no Senhor de todo o seu coração e não se apoie em seu próprio entendimento.", reference: "Provérbios 3:5" },
  { text: "O Senhor é o meu pastor, nada me faltará.", reference: "Salmos 23:1" },
  { text: "Buscai primeiro o Reino de Deus, e a sua justiça, e todas estas coisas vos serão acrescentadas.", reference: "Mateus 6:33" },
  { text: "Alegrai-vos sempre no Senhor; outra vez digo, alegrai-vos.", reference: "Filipenses 4:4" },
  { text: "Este é o dia que fez o Senhor; regozijemo-nos e alegremo-nos nele.", reference: "Salmos 118:24" },
  { text: "Não andeis cuidadosos por coisa alguma; antes as vossas petições sejam em tudo conhecidas diante de Deus pela oração e súplicas, com ação de graças.", reference: "Filipenses 4:6" },
  { text: "Lançando sobre ele toda a vossa ansiedade, porque ele tem cuidado de vós.", reference: "1 Pedro 5:7" },
  { text: "Bem-aventurados os que choram, porque eles serão consolados.", reference: "Mateus 5:4" },
  { text: "Perto está o Senhor dos que têm o coração quebrantado, e salva os contritos de espírito.", reference: "Salmos 34:18" },
  { text: "Ora, a esperança não traz confusão, porquanto o amor de Deus está derramado em nossos corações pelo Espírito Santo que nos foi dado.", reference: "Romanos 5:5" },
  { text: "Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz, e não de mal, para vos dar o fim que esperais.", reference: "Jeremias 29:11" },
  { text: "Em tudo dai graças, porque esta é a vontade de Deus em Cristo Jesus para convosco.", reference: "1 Tessalonicenses 5:18" },
  { text: "Deus é o nosso refúgio e fortaleza, socorro bem presente na angústia.", reference: "Salmos 46:1" },
  { text: "O amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha.", reference: "1 Coríntios 13:4" },
  { text: "Venham a mim, todos os que estão cansados e sobrecarregados, e eu lhes darei descanso.", reference: "Mateus 11:28" },
  { text: "O Senhor é bom, um refúgio em tempos de angústia. Ele protege os que nele confiam.", reference: "Naum 1:7" },
  { text: "Tudo quanto te vier à mão para fazer, faze-o conforme as tuas forças.", reference: "Eclesiastes 9:10" },
  { text: "Ainda que a figueira não floresça, nem haja fruto na vide, o produto da oliveira minta, e os campos não produzam mantimento, as ovelhas sejam arrebatadas do aprisco, e nos currais não haja gado; Todavia eu me alegr arei no Senhor; exultarei no Deus da minha salvação.", reference: "Habacuque 3:17-18" },
  { text: "Não temas, porque eu sou contigo; não te assombres, porque eu sou teu Deus; eu te fortaleço, e te ajudo, e te sustento com a destra da minha justiça.", reference: "Isaías 41:10" },
  { text: "Tudo posso naquele que me fortalece.", reference: "Filipenses 4:13" },
  { text: "Porque, se nós cremos que Jesus morreu e ressuscitou, assim também aos que em Jesus dormem, Deus os tornará a trazer com ele.", reference: "1 Tessalonicenses 4:14" },
  { text: "A vós graça e paz, da parte de Deus nosso Pai, e da do Senhor Jesus Cristo.", reference: "Romanos 1:7" },
  { text: "Entrega o teu caminho ao Senhor; confia nele, e ele o fará.", reference: "Salmos 37:5" },
  { text: "Ouve, Israel, o Senhor nosso Deus é o único Senhor.", reference: "Deuteronômio 6:4" },
  { text: "Porque onde estiverem dois ou três reunidos em meu nome, aí estou eu no meio deles.", reference: "Mateus 18:20" },
  { text: "Não vim chamar justos, mas pecadores, ao arrependimento.", reference: "Lucas 5:32" },
  { text: "Bem-aventurados os mansos, porque eles herdarão a terra.", reference: "Mateus 5:5" }
];

// Função para obter verso do dia
export function getTodayVerse() {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const index = dayOfYear % dailyVerses.length;
  return dailyVerses[index];
}
