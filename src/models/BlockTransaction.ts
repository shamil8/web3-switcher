import {
  Column, DataType, Model, Table,
} from 'sequelize-typescript';

/**
 * Additional entities for EXPORT!
 */
@Table
export class BlockTransaction extends Model {
  // block transaction data when created
  @Column({ type: DataType.BIGINT, allowNull: false, })
    blockNumber: number;

  @Column({ type: DataType.STRING, allowNull: false, })
    txHash: string;

  @Column({ type: DataType.STRING(15), allowNull: false, })
    net: string;
}
