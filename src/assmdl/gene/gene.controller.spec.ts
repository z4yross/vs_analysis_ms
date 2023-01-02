import { Test, TestingModule } from '@nestjs/testing';
import { GeneController } from './gene.controller';

describe('GeneController', () => {
  let controller: GeneController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeneController],
    }).compile();

    controller = module.get<GeneController>(GeneController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
