import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PrismaService } from '../../../database/prisma/prisma.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CouponType } from '@prisma/client';

@ApiTags('Teacher Coupons')
@Controller('teacher/coupons')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('TEACHER')
@ApiBearerAuth()
export class TeacherCouponsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'List all coupons for courses owned by the teacher' })
  async getCoupons(@Req() req: any) {
    const userId = req.user.id;

    // Get teacher profile
    const teacher = await this.prisma.teacherProfile.findUnique({
      where: { userId },
      include: {
        courseInstructors: {
          where: { isOwner: true },
          select: { courseId: true }
        }
      }
    });

    if (!teacher) {
      throw new NotFoundException('Teacher profile not found');
    }

    const courseIds = teacher.courseInstructors.map(ci => ci.courseId);

    const coupons = await this.prisma.coupon.findMany({
      where: {
        courseId: { in: courseIds }
      },
      include: {
        course: { select: { id: true, title: true, price: true } }
      },
      orderBy: { validFrom: 'desc' }
    });

    return coupons;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new coupon for a course' })
  async createCoupon(
    @Req() req: any,
    @Body() data: {
      code: string;
      courseId: string;
      type: CouponType;
      value: number;
      maxUses?: number;
      validFrom: Date;
      validUntil?: Date;
    }
  ) {
    const userId = req.user.id;

    // Verify teacher owns the course
    const isOwner = await this.prisma.courseInstructor.findFirst({
      where: {
        courseId: data.courseId,
        teacher: { userId },
        isOwner: true
      }
    });

    if (!isOwner) {
      throw new ForbiddenException('You do not have permission to create coupons for this course');
    }

    // Check if code exists
    const existing = await this.prisma.coupon.findUnique({
      where: { code: data.code.toUpperCase() }
    });

    if (existing) {
      throw new BadRequestException('Coupon code already exists');
    }

    const coupon = await this.prisma.coupon.create({
      data: {
        code: data.code.toUpperCase(),
        type: data.type,
        value: data.value,
        maxUses: data.maxUses,
        validFrom: new Date(data.validFrom),
        validUntil: data.validUntil ? new Date(data.validUntil) : null,
        courseId: data.courseId,
        isActive: true,
      }
    });

    return coupon;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete or deactivate a coupon' })
  async deleteCoupon(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.id;

    const coupon = await this.prisma.coupon.findUnique({
      where: { id },
      include: {
        course: {
          include: {
            instructors: {
              where: { teacher: { userId }, isOwner: true }
            }
          }
        }
      }
    });

    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    if (!coupon.course?.instructors.length) {
      throw new ForbiddenException('You do not have permission to delete this coupon');
    }

    await this.prisma.coupon.delete({ where: { id } });

    return { success: true, message: 'Coupon deleted successfully' };
  }
}
