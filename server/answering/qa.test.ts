import { getAnswer } from './qa'

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
})
