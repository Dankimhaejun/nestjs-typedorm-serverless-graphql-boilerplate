import { Inject } from '@nestjs/common';
import {
  BatchManager,
  Connection,
  EntityManager,
  ScanManager,
} from '@typedorm/core';

export const InjectEntityManager = () => Inject(EntityManager);

export const InjectEntityBatchManager = () => Inject(BatchManager);

export const InjectScanManager = () => Inject(ScanManager);

export const InjectConnection = () => Inject(Connection);
