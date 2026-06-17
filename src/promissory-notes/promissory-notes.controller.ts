import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { PromissoryNotesService } from './promissory-notes.service';
import { CreatePromissoryNoteDto } from './dto/create-promissory-note.dto';
import { UpdatePromissoryNoteDto } from './dto/update-promissory-note.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('promissory-notes')
export class PromissoryNotesController {
  constructor(
    private readonly promissoryNotesService: PromissoryNotesService,
  ) {}

  @Post()
  create(@Body() createPromissoryNoteDto: CreatePromissoryNoteDto) {
    return this.promissoryNotesService.create(createPromissoryNoteDto);
  }

  @Get()
  findAll() {
    return this.promissoryNotesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.promissoryNotesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePromissoryNoteDto: UpdatePromissoryNoteDto,
  ) {
    return this.promissoryNotesService.update(id, updatePromissoryNoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.promissoryNotesService.remove(id);
  }
}
