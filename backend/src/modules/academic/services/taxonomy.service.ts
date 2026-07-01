import { Injectable, NotFoundException } from '@nestjs/common';
import { AcademicRepository } from '../academic.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class TaxonomyService {
  constructor(
    private readonly repo: AcademicRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createCategory(
    name: string,
    slug: string,
    parentId?: string,
    description?: string,
    icon?: string,
  ) {
    if (parentId) {
      // Prevent circular logic or self referencing
      const parents = await this.repo.findCategories(); // Just checking if it exists
      if (!parents.some((c) => c.id === parentId)) {
        throw new NotFoundException('Parent category not found');
      }
    }
    const cat = await this.repo.createCategory({
      name,
      slug,
      parentId,
      description,
      icon,
    });
    this.eventEmitter.emit('academic.category.created', cat);
    return cat;
  }

  async getCategories() {
    return this.repo.findCategories();
  }

  async deleteCategory(id: string) {
    return this.repo.softDeleteCategory(id);
  }

  async createTag(name: string, slug: string) {
    const tag = await this.repo.createTag({ name, slug });
    this.eventEmitter.emit('academic.tag.created', tag);
    return tag;
  }

  async getTags() {
    return this.repo.findTags();
  }

  async createSkill(name: string, slug: string) {
    return this.repo.createSkill({ name, slug });
  }

  async getSkills() {
    return this.repo.findSkills();
  }

  async createSpecialization(name: string, slug: string, description?: string) {
    return this.repo.createSpecialization({ name, slug, description });
  }

  async getSpecializations() {
    return this.repo.findSpecializations();
  }
}
