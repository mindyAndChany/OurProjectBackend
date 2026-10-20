import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Student } from '../models/student.model.js';
import { StudentDocument } from '../models/student_document.model.js';

// מחיקת תלמידה לפי מספר זהות, כולל כל הנתונים התלויים בה (מסמכים, נוכחות, הישגים).
// המחיקה מתבצעת בטרנזקציה: או שהכל נמחק, או ששום דבר לא משתנה.
@Injectable()
export class DeleteStudentService {
  constructor(
    @InjectModel(Student)
    private studentModel: typeof Student,
    @InjectModel(StudentDocument)
    private documentModel: typeof StudentDocument,
  ) {}

  async deleteByIdNumber(idNumber: string) {
    if (!idNumber) throw new BadRequestException('id parameter required');
    const sId = String(idNumber).trim().replace(/\D/g, '');
    if (sId === '') throw new BadRequestException('invalid id_number');

    // המפתח הראשי של תלמידה יכול להיות שמור כמספר (id) או כמחרוזת (id_number)
    const student = await this.studentModel.findOne({
      where: { [Op.or]: [{ id_number: sId }, { id_number: String(Number(sId)) }] },
    });
    if (!student) throw new NotFoundException(`Student with id_number ${sId} not found`);

    const studentPk = student.id;
    const snapshot = student.get({ plain: true }) as Record<string, any>;

    const dependentTables = await this.existingTables(['student_achievements', 'attendance']);
    const transaction = await this.studentModel.sequelize!.transaction();
    try {
      // שולפים את רשימת המסמכים לפני המחיקה, כדי להחזיר את שמות הקבצים באחסון
      const documents = await this.documentModel.findAll({
        attributes: ['id', 'public_id'],
        where: { student_id: studentPk },
        transaction,
      });

      // טבלאות שמפנות לתלמידה דרך student_id — חייבות להימחק לפני רשומת התלמידה עצמה
      await this.documentModel.destroy({ where: { student_id: studentPk }, transaction });
      for (const table of dependentTables) {
        await this.deleteDependent(table, studentPk, transaction);
      }

      await this.studentModel.destroy({ where: { id: studentPk }, transaction });

      await transaction.commit();

      return {
        deleted: true,
        id_number: snapshot.id_number,
        // שמות הקבצים באחסון (Cloudinary) — הפרונט יכול להציע להשלים מחיקה מהענן בעתיד
        file_public_ids: documents.map((d: any) => d.public_id).filter(Boolean),
      };
    } catch (err) {
      await transaction.rollback();
      console.error('Failed to delete student:', err);
      throw new BadRequestException('Failed to delete student: ' + ((err as any)?.message || err));
    }
  }

  // מחזיר רק את הטבלאות שאכן קיימות בסביבה הנוכחית, כדי לא להפיל מחיקה בגלל טבלה חסרה
  private async existingTables(names: string[]): Promise<string[]> {
    const found = await this.studentModel.sequelize!.getQueryInterface().showAllTables();
    const set = new Set(found.map((t: any) => String(typeof t === 'string' ? t : t.tableName)));
    return names.filter((n) => set.has(n));
  }

  // מחיקה גולמית, כי טבלאות אלה אינן רשומות כמודלים בשירות הזה.
  // שמות הטבלאות מוגדרים בקוד (לא מגיעים מהמשתמש), ולכן הבנייה בשאילתה בטוחה.
  private async deleteDependent(table: string, value: number, transaction: any): Promise<void> {
    await this.studentModel.sequelize!.query(
      `DELETE FROM "${table}" WHERE "student_id" = ?`,
      { replacements: [value], transaction },
    );
  }
}
