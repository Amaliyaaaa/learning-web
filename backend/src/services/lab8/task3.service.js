import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import task2Service from './task2.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '..', '..', '..', 'data', 'lab8', 'task3');
const resultsFilePath = path.join(dataDir, 'resultsQatar22.json');

class Task3Service {
  async generateResults() {
    const groups = await task2Service.getGroups();
    const allMatches = Object.values(groups).flatMap(group => 
      group.matches.map(match => ({
        group: group.group,
        date: match.date,
        time: match.time,
        team1: match.team1,
        score1: match.score1,
        score2: match.score2,
        team2: match.team2,
        stadium: match.stadium
      }))
    );

    allMatches.sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(resultsFilePath, JSON.stringify(allMatches, null, 2), 'utf8');
    return allMatches;
  }

  async getResults() {
    try {
      const data = await fs.readFile(resultsFilePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return await this.generateResults();
      }
      throw error;
    }
  }
}

export default new Task3Service();

