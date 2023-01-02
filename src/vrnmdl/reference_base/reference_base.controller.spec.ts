import { Test, TestingModule } from '@nestjs/testing';
import { ReferenceBaseController } from './reference_base.controller';

describe('ReferenceBaseController', () => {
  let controller: ReferenceBaseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReferenceBaseController],
    }).compile();

    controller = module.get<ReferenceBaseController>(ReferenceBaseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
