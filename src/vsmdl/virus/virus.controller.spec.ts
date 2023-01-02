import { Test, TestingModule } from '@nestjs/testing';
import { VirusController } from './virus.controller';

describe('VirusController', () => {
  let controller: VirusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VirusController],
    }).compile();

    controller = module.get<VirusController>(VirusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
