import { Test, TestingModule } from '@nestjs/testing';
import { ProteinController } from './protein.controller';

describe('ProteinController', () => {
  let controller: ProteinController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProteinController],
    }).compile();

    controller = module.get<ProteinController>(ProteinController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
