import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
export class Image {
  @PrimaryGeneratedColumn({type: 'bigint'})

  id: number;

  @Index()
  @Column({type: 'timestamp', default: 'now()'})
  created_at: Date;

  @Column({type: 'varchar', length: 128})
  hash: string;

  @Index()
  @Column({type: 'bigint'})
  collection_id: number;

  @Index()
  @Column({type: 'bigint', nullable: true})
  token_id: number;

  @Column({type: 'text', nullable: true})
  ipfs_address: string;

  @Column({type: 'text', nullable: true})
  tmp_address: string;
}

@Entity()
export class UploadLog {
  @PrimaryGeneratedColumn({type: 'bigint'})
  id: number;

  @Index()
  @Column({type: 'timestamp', default: 'now()'})
  created_at: Date;

  @Column({type: 'text', nullable: true})
  user_agent: string;

  @Column({type: 'varchar', length: 128})
  ip_address: string;

  @Column({type: 'varchar', length: 32, default: 'image'})
  entity_type: string;

  @Column('text')
  file_path: string;
}