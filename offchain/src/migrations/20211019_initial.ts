import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class Initial_20211019000000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "image",
      columns: [
        {
          name: "id",
          type: "bigint",
          isPrimary: true,
          isGenerated: true,
          generationStrategy: "increment"
        },
        {
          name: "created_at",
          type: "timestamp",
          default: "now()"
        },
        {
          name: "hash",
          type: "varchar",
          length: "128"
        },
        {
          name: "collection_id",
          type: "bigint"
        },
        {
          name: "token_id",
          type: "bigint",
          isNullable: true
        },
        {
          name: "ipfs_address",
          type: "text",
          isNullable: true
        },
        {
          name: "tmp_address",
          type: "text",
          isNullable: true
        }
      ]
    }), true);

    await queryRunner.createIndex("image", new TableIndex({
      name: "IDX_IMAGE_CREATED_AT",
      columnNames: ["created_at"]
    }));

    await queryRunner.createIndex("image", new TableIndex({
      name: "IDX_IMAGE_COLLECTION_ID",
      columnNames: ["collection_id"]
    }));

    await queryRunner.createIndex("image", new TableIndex({
      name: "IDX_IMAGE_TOKEN_ID",
      columnNames: ["token_id"]
    }));

    await queryRunner.createTable(new Table({
      name: "upload_log",
      columns: [
        {
          name: "id",
          type: "bigint",
          isPrimary: true,
          isGenerated: true,
          generationStrategy: "increment"
        },
        {
          name: "created_at",
          type: "timestamp",
          default: "now()"
        },
        {
          name: "user_agent",
          type: "text",
          isNullable: true
        },
        {
          name: "ip_address",
          type: "varchar",
          length: "128"
        },
        {
          name: "entity_type",
          type: "varchar",
          length: "32",
          default: "'image'"
        },
        {
          name: "file_path",
          type: "text"
        }
      ]
    }), true);

    await queryRunner.createIndex("upload_log", new TableIndex({
      name: "IDX_UPLOAD_LOG_CREATED_AT",
      columnNames: ["created_at"]
    }));

  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex("upload_log", "IDX_UPLOAD_LOG_CREATED_AT");
    await queryRunner.dropTable("upload_log");
    await queryRunner.dropIndex("image", "IDX_IMAGE_CREATED_AT");
    await queryRunner.dropIndex("image", "IDX_IMAGE_COLLECTION_ID");
    await queryRunner.dropIndex("image", "IDX_IMAGE_TOKEN_ID");
    await queryRunner.dropTable("image");
  }

}