import { Test, TestingModule } from '@nestjs/testing';
import { UtrController } from './utr.controller';

describe('UtrController', () => {
  let controller: UtrController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UtrController],
    }).compile();

    controller = module.get<UtrController>(UtrController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
