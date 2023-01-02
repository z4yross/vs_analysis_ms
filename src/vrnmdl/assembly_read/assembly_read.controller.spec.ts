import { Test, TestingModule } from '@nestjs/testing';
import { AssemblyReadController } from './assembly_read.controller';

describe('AssemblyReadController', () => {
  let controller: AssemblyReadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssemblyReadController],
    }).compile();

    controller = module.get<AssemblyReadController>(AssemblyReadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
