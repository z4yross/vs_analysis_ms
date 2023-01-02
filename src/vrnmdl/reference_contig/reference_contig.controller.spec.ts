import { Test, TestingModule } from '@nestjs/testing';
import { ReferenceContigController } from './reference_contig.controller';

describe('ReferenceContigController', () => {
  let controller: ReferenceContigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReferenceContigController],
    }).compile();

    controller = module.get<ReferenceContigController>(ReferenceContigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
