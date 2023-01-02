import { Test, TestingModule } from '@nestjs/testing';
import { ReferenceGenomeController } from './reference_genome.controller';

describe('ReferenceGenomeController', () => {
  let controller: ReferenceGenomeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReferenceGenomeController],
    }).compile();

    controller = module.get<ReferenceGenomeController>(ReferenceGenomeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
