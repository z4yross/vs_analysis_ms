import { Test, TestingModule } from '@nestjs/testing';
import { HumanVariantController } from './human_variant.controller';

describe('HumanVariantController', () => {
  let controller: HumanVariantController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HumanVariantController],
    }).compile();

    controller = module.get<HumanVariantController>(HumanVariantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
