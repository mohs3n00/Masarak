import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service';

@Injectable()
export class AdminTaxonomyService {
  constructor(private readonly prisma: PrismaService) {}

  // --- Categories ---
  async getCategories() {
    return this.prisma.category.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async createCategory(dto: { name: string; description?: string }) {
    let slug = dto.name.trim().toLowerCase().replace(/\s+/g, '-');
    const existing = await this.prisma.category.findUnique({ where: { slug } });
    if (existing) slug += '-' + Date.now();

    return this.prisma.category.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description,
      },
    });
  }

  async updateCategory(id: string, dto: { name?: string; description?: string }) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');

    let slug = category.slug;
    if (dto.name && dto.name !== category.name) {
      slug = dto.name.trim().toLowerCase().replace(/\s+/g, '-');
      const existing = await this.prisma.category.findUnique({ where: { slug } });
      if (existing && existing.id !== id) slug += '-' + Date.now();
    }

    return this.prisma.category.update({
      where: { id },
      data: {
        ...dto,
        slug,
      },
    });
  }

  async deleteCategory(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    return this.prisma.category.delete({ where: { id } });
  }

  // --- Subjects ---
  async getSubjects() {
    return this.prisma.subject.findMany({
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createSubject(dto: { name: string; description?: string; categoryId?: string }) {
    let slug = dto.name.trim().toLowerCase().replace(/\s+/g, '-');
    const existing = await this.prisma.subject.findUnique({ where: { slug } });
    if (existing) slug += '-' + Date.now();

    return this.prisma.subject.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description,
        categoryId: dto.categoryId,
      },
      include: { category: true }
    });
  }

  async updateSubject(id: string, dto: { name?: string; description?: string; categoryId?: string }) {
    const subject = await this.prisma.subject.findUnique({ where: { id } });
    if (!subject) throw new NotFoundException('Subject not found');

    let slug = subject.slug;
    if (dto.name && dto.name !== subject.name) {
      slug = dto.name.trim().toLowerCase().replace(/\s+/g, '-');
      const existing = await this.prisma.subject.findUnique({ where: { slug } });
      if (existing && existing.id !== id) slug += '-' + Date.now();
    }

    return this.prisma.subject.update({
      where: { id },
      data: {
        ...dto,
        slug,
      },
      include: { category: true }
    });
  }

  async deleteSubject(id: string) {
    const subject = await this.prisma.subject.findUnique({ where: { id } });
    if (!subject) throw new NotFoundException('Subject not found');
    return this.prisma.subject.delete({ where: { id } });
  }
}
