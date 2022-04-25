import {
  Table, Column, Model, DataType,
} from 'sequelize-typescript';

@Table
export class Person extends Model {
  @Column(DataType.STRING)
    name: string;

  @Column(DataType.DATE)
    birthday: Date;
}
