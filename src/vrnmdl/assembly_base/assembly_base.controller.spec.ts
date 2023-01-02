import { Test, TestingModule } from '@nestjs/testing';
import { AssemblyBaseController } from './assembly_base.controller';

describe('AssemblyBaseController', () => {
  let controller: AssemblyBaseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssemblyBaseController],
    }).compile();

    controller = module.get<AssemblyBaseController>(AssemblyBaseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
