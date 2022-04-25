import {
  Column, DataType, Model, Table,
} from 'sequelize-typescript';

export interface IUrlInfo {
    url: string,
    urlReTry: number,
}

@Table
export class NodeProvider extends Model {
    @Column({ primaryKey: true, type: DataType.STRING, allowNull: false, })
      protocol: string;

    @Column({ primaryKey: true, type: DataType.STRING, allowNull: false, })
      net: string;

    @Column({ type: DataType.ARRAY(DataType.JSON), allowNull: false, })
      providers: IUrlInfo[];

    @Column({ type: DataType.INTEGER, allowNull: false, })
      reTry: number;

    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false, })
      isStop: boolean;

    @Column(DataType.STRING)
      lastProvider?: string;
}
