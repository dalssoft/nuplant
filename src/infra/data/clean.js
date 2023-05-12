const readline = require('readline')
const connection = require('./database/connection')

async function cleanDatabase() {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

    await new Promise((resolve) => rl.question('⚠️ WARNING: This will delete all data from the database. Press ENTER to continue or CTRL + C to abort.', resolve))

    try {
        await connection.raw('DROP SCHEMA IF EXISTS public CASCADE;')
        await connection.raw('CREATE SCHEMA public;')

        console.log('Database cleaned successfully.')
    } catch (error) {
        console.log('Error cleaning the database.')
        console.log(error)
    }

    rl.close()
}

cleanDatabase().then(() => process.exit(0))