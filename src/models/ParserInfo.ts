import {
  Column, DataType, Model, Table,
} from 'sequelize-typescript';

@Table
export class ParserInfo extends Model {
  @Column({ primaryKey: true, type: DataType.STRING, allowNull: false, })
    address: string;

  @Column({ primaryKey: true, type: DataType.STRING, allowNull: false, })
    network: string;

  @Column({ type: DataType.BIGINT, defaultValue: 0, })
    lastBlock: number;
}
