import { PartialType } from '@nestjs/mapped-types';
import { CreatePromissoryNoteDto } from './create-promissory-note.dto';

export class UpdatePromissoryNoteDto extends PartialType(
  CreatePromissoryNoteDto,
) {}
