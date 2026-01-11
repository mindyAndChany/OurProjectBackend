import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';

@Table({ tableName: 'students', timestamps: false })
export class Student extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  first_name!: string;

  @Column(DataType.STRING)
  last_name!: string;

  @Column(DataType.STRING)
  id_number!: string;

  @Column(DataType.STRING)
  phone!: string;

  @Column(DataType.STRING)
  marital_status!: string;

  @Column(DataType.STRING)
  address!: string;

  @Column(DataType.INTEGER)
  registration_year!: number;

  @Column(DataType.BOOLEAN)
  is_graduate!: boolean;

 

  @Column(DataType.STRING)
  track!: string;

  @Column(DataType.STRING)
  track2!: string;

  @Column(DataType.STRING)
  track3!: string;

  @Column(DataType.STRING)
  payment_status!: string;

  @Column(DataType.DECIMAL)
  paid_amount!: number;

  @Column(DataType.DATE)
  birthdate_gregorian!: Date;

  @Column(DataType.STRING)
  birthdate_hebrew!: string;

  @Column(DataType.DATE)
  married_date!: Date;

  @Column(DataType.STRING)
  married_name!: string;

  @Column(DataType.TEXT)
  notes!: string;

  @Column(DataType.STRING)
  city_he!: string;

  @Column(DataType.STRING)
  zipcode!: string;

  @Column(DataType.STRING)
  landline!: string;

  @Column(DataType.STRING)
  father_name_he!: string;

  @Column(DataType.STRING)
  father_mobile_he!: string;

  @Column(DataType.STRING)
  mother_name_he!: string;

  @Column(DataType.STRING)
  mother_mobile_he!: string;

  @Column(DataType.STRING)
  bookshelf!: string;

  @Column(DataType.BOOLEAN)
  perach!: boolean;

  @Column(DataType.BOOLEAN)
  chetz!: boolean;

  @Column(DataType.STRING)
  external_mother!: string;

  @Column(DataType.STRING)
  external_father!: string;

  @Column(DataType.STRING)
  birth_country!: string;

  @Column(DataType.STRING)
  personal_mobile!: string;

  @Column(DataType.STRING)
  nickname!: string;

  @Column(DataType.STRING)
  serial_number!: string;

  @Column(DataType.STRING)
  payment_method!: string;

  @Column(DataType.STRING)
  trend!: string;
}
