"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMigrations = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const database_1 = require("../config/database");
const MIGRATIONS_DIR = path_1.default.join(__dirname, 'migrations');
const createMigrationsTable = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
    await database_1.pool.query(query);
};
const getExecutedMigrations = async () => {
    const result = await database_1.pool.query('SELECT filename FROM migrations ORDER BY id');
    return result.rows.map((row) => row.filename);
};
const executeMigration = async (filename) => {
    const filePath = path_1.default.join(MIGRATIONS_DIR, filename);
    const sql = fs_1.default.readFileSync(filePath, 'utf8');
    const client = await database_1.pool.connect();
    try {
        await client.query('BEGIN');
        await client.query(sql);
        await client.query('INSERT INTO migrations (filename) VALUES ($1)', [filename]);
        await client.query('COMMIT');
        console.log(`✅ Migration ${filename} executed successfully`);
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.error(`❌ Migration ${filename} failed:`, error);
        throw error;
    }
    finally {
        client.release();
    }
};
const runMigrations = async () => {
    try {
        console.log('🔄 Starting database migrations...');
        await createMigrationsTable();
        const executedMigrations = await getExecutedMigrations();
        const migrationFiles = fs_1.default.readdirSync(MIGRATIONS_DIR)
            .filter(file => file.endsWith('.sql'))
            .sort();
        const pendingMigrations = migrationFiles.filter(file => !executedMigrations.includes(file));
        if (pendingMigrations.length === 0) {
            console.log('✅ No pending migrations');
            return;
        }
        console.log(`📋 Found ${pendingMigrations.length} pending migrations`);
        for (const migration of pendingMigrations) {
            await executeMigration(migration);
        }
        console.log('✅ All migrations completed successfully');
    }
    catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
};
exports.runMigrations = runMigrations;
if (require.main === module) {
    (0, exports.runMigrations)()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}
//# sourceMappingURL=migrate.js.map