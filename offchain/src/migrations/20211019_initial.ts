import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

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
      name: "image_storage",
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
          name: "storage_backend",
          type: "varchar",
          length: "32"
        },
        {
          name: "image_id",
          type: "bigint"
        },
        {
          name: "data",
          type: "jsonb"
        }
      ]
    }), true);

    await queryRunner.createForeignKey("image_storage", new TableForeignKey({
      columnNames: ["image_id"],
      referencedColumnNames: ["id"],
      referencedTableName: "image",
      name: "REF_IMAGE_STORAGE_IMAGE_ID",
      onDelete: "CASCADE"
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
    await queryRunner.dropForeignKey("image_storage", "REF_IMAGE_STORAGE_IMAGE_ID");
    await queryRunner.dropTable("image_storage")
    await queryRunner.dropIndex("image", "IDX_IMAGE_CREATED_AT");
    await queryRunner.dropIndex("image", "IDX_IMAGE_COLLECTION_ID");
    await queryRunner.dropIndex("image", "IDX_IMAGE_TOKEN_ID");
    await queryRunner.dropTable("image");
  }

}