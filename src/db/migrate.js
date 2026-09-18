const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function runMigrationsAndSeeds() {
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'gestionale',
    multipleStatements: true,
  };

  const connection = await mysql.createConnection(dbConfig);

  try {
    // Ensure migrations table exists
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Ensure seeds table exists
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS seeds (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Run migrations
    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    for (const file of migrationFiles) {
      const migrationName = file;
      const [rows] = await connection.execute(
        'SELECT 1 FROM migrations WHERE name = ? LIMIT 1',
        [migrationName]
      );
      if (rows.length === 0) {
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        console.log(`Applying migration: ${migrationName}`);
        await connection.execute(sql);
        await connection.execute(
          'INSERT INTO migrations (name) VALUES (?)',
          [migrationName]
        );
        console.log(`Migration applied: ${migrationName}`);
      } else {
        console.log(`Skipping already applied migration: ${migrationName}`);
      }
    }

    // Run seeds
    const seedsDir = path.join(__dirname, 'seeds');
    const seedFiles = fs.readdirSync(seedsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    for (const file of seedFiles) {
      const seedName = file;
      const [rows] = await connection.execute(
        'SELECT 1 FROM seeds WHERE name = ? LIMIT 1',
        [seedName]
      );
      if (rows.length === 0) {
        const sql = fs.readFileSync(path.join(seedsDir, file), 'utf8');
        console.log(`Applying seed: ${seedName}`);
        await connection.execute(sql);
        await connection.execute(
          'INSERT INTO seeds (name) VALUES (?)',
          [seedName]
        );
        console.log(`Seed applied: ${seedName}`);
      } else {
        console.log(`Skipping already applied seed: ${seedName}`);
      }
    }

    console.log('All migrations and seeds have been processed successfully.');
  } catch (err) {
    console.error('Error during migration or seeding:', err);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

runMigrationsAndSeeds();