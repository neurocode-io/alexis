import { loadModel } from './inference'
import { getAnswer } from './qa'

beforeAll(async () => await loadModel())

describe('answering/qa', () => {
  it('should answer the question given the context', async () => {
    const { answer, score } = await getAnswer(
      'Which name is also used to describe the Amazon rainforest in English?',
      `The Amazon rainforest (Portuguese: Floresta Amazônica or Amazônia; Spanish: Selva Amazónica, Amazonía or usually Amazonia; French: Forêt amazonienne; Dutch: Amazoneregenwoud), also known in English as Amazonia or the Amazon Jungle, is a moist broadleaf forest that covers most of the Amazon basin of South America. This basin encompasses 7,000,000 square kilometres (2,700,000 sq mi), of which 5,500,000 square kilometres (2,100,000 sq mi) are covered by the rainforest. This region includes territory belonging to nine nations. The majority of the forest is contained within Brazil, with 60% of the rainforest, followed by Peru with 13%, Colombia with 10%, and with minor amounts in Venezuela, Ecuador, Bolivia, Guyana, Suriname and French Guiana. States or departments in four nations contain 'Amazonas' in their names. The Amazon represents over half of the planet's remaining rainforests, and comprises the largest and most biodiverse tract of tropical rainforest in the world, with an estimated 390 billion individual trees divided into 16,000 species.`
    )

    expect(answer).toEqual('Amazonia or the Amazon Jungle')
    expect(score).toEqual(0.74)
  })

  it('should answer the second question given the context', async () => {
    const { answer, score } = await getAnswer(
      'What discipline did Winckelmann create?',
      `Johann Joachim Winckelmann was a German art historian and archaeologist. He was a pioneering Hellenist who first articulated the difference between Greek, Greco-Roman and Roman art. The prophet and founding hero of modern archaeology, Winckelmann was one of the founders of scientific archaeology and first applied the categories of style on a large, systematic basis to the history of art.`
    )

    expect(answer).toEqual('Scientific archaeology')
    expect(score).toEqual(0.72)
  })

  it('should not answer the question given a nonsense context', async () => {
    const { answer, score } = await getAnswer(
      'Which name is also used to describe the Amazon rainforest in English?',
      `Johann Joachim Winckelmann was a German art historian and archaeologist. He was a pioneering Hellenist who first articulated the difference between Greek, Greco-Roman and Roman art. The prophet and founding hero of modern archaeology, Winckelmann was one of the founders of scientific archaeology and first applied the categories of style on a large, systematic basis to the history of art.`
    )

    expect(answer).toEqual('')
    expect(score).toEqual(0.98)
  })

  it('should answer the question in a long context', async () => {
    const context = `The Vystar Arena in Jacksonville, Florida was home to a great night of fights at UFC 261: Usman vs. Masvidal 2. The card saw seven (T)KOs, two submissions, and four decisions, including two split-decisions. The show opened with Ariane Carnelossi taking out Na Liang with a TKO in the second round to get the night started. Jeffrey Molina and Qileng Aori put on a helluva scrap that saw Molina victorious via unanimous decision. Kazula Vargas picked apart Rong Zhu, taking the unanimous decision that had a pretty wide range of scoring (30-26, 29-28 x2). Danaa Batgerel defeated Kevin Natividad with a sensational, first-round TKO and he did it in under a minute to wrap up the early prelims. The televised prelims started with Patrick Sabatini outclassing Tristan Connelly via unanimous decision. Brendan Allen and Karl Roberson put on a sensational fight for almost five minutes, but Allen secured a buzzerbeater heel hook to snag the victory. Dwight Grant and Stefan Sekulic battled to a split-decision that saw Grant log another win for the record book. Randy Brown needed less than three minutes to choke out “Cowboy” Oliveira and he did with just one arm. Outstanding way to wrap the undercard. The main card opened with Anthony Smith and Jimmy Crute having a spirited fight, but it wore on one of Crute’s legs enough to have the fight waved off between the first and second round. Honestly, how Crute was able to fight as long as he did was a testament to mental fortitude. Smith looked in peak form. Uriah Hall won in 17 seconds flat, but it was due to Chris Weidman suffering the exact same fate Anderson Silva suffered in their infamous first bout where Silva suffered the same gruesome leg break. Valentina Shevchenko had no problem picking apart Jessica Andrade in the first of three sensational title fights. She overpowered Andrade easily, boxed her up, kicked her brutally, andf in the second round, she finished the Brazilian powerhouse with vicious elbows. She looked like a machine, like a Terminator. Rose Namajunas needed just 78 seconds to leg kick Zhang Weili into another dimension, becoming one of the rare unicorns that won back a title after losing it. Kamaru Usman dominated the first round of his rematch against Jorge Masvidal, proving that whether it be six days notice or six weeks of a full camp, he is still at the top of the food chain. Just a minute into the second round, after winging seemingly sloppy overhands, he launched a perfect right down the middle and cracked Masvidal so perfectly, the Cuban was out before he hit the ground. Herb Dean was late to get to Masvidal and Usman managed to land a couple more. Usman is a bad, bad man.`
    const { answer: a1 } = await getAnswer('How long did it take for Uriah Hall to win?', context)
    const { answer: a2 } = await getAnswer('How looked like a terminator?', context)

    expect(a1).toEqual('17 seconds flat')
    expect(a2).toEqual('Valentina Shevchenko')
  })
})
