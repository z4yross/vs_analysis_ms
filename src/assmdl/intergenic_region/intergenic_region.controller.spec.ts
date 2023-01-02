import { Test, TestingModule } from '@nestjs/testing';
import { IntergenicRegionController } from './intergenic_region.controller';

describe('IntergenicRegionController', () => {
  let controller: IntergenicRegionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IntergenicRegionController],
    }).compile();

    controller = module.get<IntergenicRegionController>(IntergenicRegionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
