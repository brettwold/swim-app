import { Injectable }     from '@angular/core';
import { Platform }       from 'ionic-angular';
import * as lf            from 'lovefield';

var dbSchema;

@Injectable()
export class Schema {

  public swimtimes :any;

  constructor(public db :any) {
    this.swimtimes = db.getSchema().table('swimtimes');
  }

  static buildSchema(platform: Platform) :Promise<Schema> {
    return new Promise((resolve, reject) => {

      if(!dbSchema) {
        let schemaBuilder = lf.schema.create('swimdata', 3);

        schemaBuilder.createTable('swimtimes').
            addColumn('swimmer_regno', lf.Type.INTEGER).
            addColumn('source', lf.Type.STRING).
            addColumn('race_type', lf.Type.INTEGER).
            addColumn('date', lf.Type.STRING).
            addColumn('unix', lf.Type.INTEGER).
            addColumn('time', lf.Type.INTEGER).
            addColumn('conv', lf.Type.INTEGER).
            addColumn('time_orig', lf.Type.STRING).
            addColumn('fina_points', lf.Type.INTEGER).
            addColumn('round', lf.Type.STRING).
            addColumn('meet_name', lf.Type.STRING).
            addColumn('venue', lf.Type.STRING).
            addColumn('license', lf.Type.STRING).
            addColumn('level', lf.Type.INTEGER).
            addPrimaryKey(['swimmer_regno', 'race_type', 'date', 'time']).
            addIndex('idxDate', ['date'], false, lf.Order.DESC).
            addNullable(['time_orig', 'license', 'level', 'fina_points', 'round', 'meet_name', 'conv']);

        let connectionOptions = { storeType: lf.schema.DataStoreType.INDEXED_DB, onUpgrade: this.onUpgrade };
        if (platform.is('ios') || platform.is('android')) {
          connectionOptions = { storeType: lf.schema.DataStoreType.WEB_SQL, onUpgrade: this.onUpgrade };
        }

        schemaBuilder.connect(connectionOptions).then((database) => {
          dbSchema = new Schema(database);
          resolve(dbSchema);
        });
      } else {
        resolve(dbSchema);
      }
    });
  }

  static onUpgrade(rawDb) {
    let version = rawDb.getVersion();
    console.log(version);

    if(version == 1) {
      console.log("Adding column");
      return rawDb.addTableColumn('swimtimes', 'unix', 0);
    }
  }
}
