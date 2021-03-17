import { Application, Request, Response } from 'express';
import { Trail } from '../entity/Trail';
import { HikEasyApp } from '../HikEasyApp';

export class TrailService {
  public constructor(app: Application) {
    app.get('/trails/get_all', this.getAllTrails);
    app.post('/trails/add_trail', this.addTrail);
    app.post('/trails/update_trail/:trailID', this.updateTrail);
    app.get('/trails/fake_add', this.testFakeAddTrail);
    app.get('/trails/search_test', this.searchSomeTrailTest);
    app.post('/trails/post_test', this.postTest);
    // this.testtest();
  }

  private async getAllTrails(req: Request, res: Response) {
    const trails = await HikEasyApp.Instance.EntityManager?.find(Trail);
    if (trails == undefined) {
      // failed to connect to database
      res.status(503).json({
        message: 'Database unreachable',
      });
    } else {
      // ok
      res.status(200).json(trails);
    }
  }

  private async addTrail(req: Request, res: Response) {
    // check that all required details are here.
    const trail = new Trail();
    trail.name = req.body['trailName'];
    trail.difficulty = req.body['trailDifficulty'];
    trail.description = req.body['trailDescription'] ?? '';
    if (trail.name === undefined) {
      res.json({
        success: false,
        message: 'Missing trail name',
      });
      return;
    }
    if (trail.name.length == 0) {
      res.json({
        success: false,
        message: 'Trail name cannot be empty',
      });
      return;
    }
    if (trail.difficulty === undefined) {
      res.json({
        success: false,
        message: 'Missing trail difficulty',
      });
      return;
    }
    if (trail.difficulty < 0 || trail.difficulty > 5) {
      res.json({
        success: false,
        message: 'Invalid difficulty',
      });
      return;
    }
    // no problem, can insert!
    if (HikEasyApp.Instance.EntityManager == undefined) {
      res.json({
        success: false,
        message: 'Database unreachable',
      });
      return;
    }
    HikEasyApp.Instance.EntityManager.save(trail);
    // successfully inserted
    // todo what if we failed to insert at db level
    res.json({
      success: true,
      message: 'OK',
    });
  }

  private async updateTrail(req: Request, res: Response) {}

  private async searchSomeTrailTest(req: Request, res: Response) {
    console.log(req.query['a']);
    res.json({});
  }

  private async postTest(req: Request, res: Response) {
    console.log('query');
    console.log(req.query);
    console.log('body');
    console.log(req.body);
    res.json({});
  }

  private async testFakeAddTrail(req: Request, res: Response) {
    console.log('I receive fake add request');
    const trail = new Trail();
    trail.difficulty = 4;
    trail.name = 'fake trailk';
    trail.description = '';
    trail.isVerified = false;
    const val = HikEasyApp.Instance?.EntityManager?.save(trail);
    console.log(val);
    res.json({});
  }

  private async testtest() {
    await this.testEmptyInsert();
  }

  private async testEmptyInsert() {
    const trail = new Trail();
    trail.difficulty = 4;
    trail.name = 'Dragon Back';
    trail.description = '';
    trail.isVerified = false;
    const value = await HikEasyApp.Instance?.EntityManager?.save(trail);
    console.log(value);
  }
}