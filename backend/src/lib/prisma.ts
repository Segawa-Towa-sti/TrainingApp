// .envファイルの内容を環境変数として読み込む
// これによりprocess.env.DATABASE_URLが使えるようになる
import 'dotenv/config';

// PrismaのDBクライアント本体を取り込む
import { PrismaClient } from '@prisma/client';

// PostgreSQL用のドライバーアダプターを取り込む
// Prisma 7ではアダプターを使ってDB接続する必要がある
import { PrismaPg } from '@prisma/adapter-pg';

// .envのDATABASE_URLを取り出す
// 例: postgresql://trainingapp:pass@localhost:5432/trainingapp_db
const connectionString = process.env.DATABASE_URL;

// DATABASE_URLが設定されていない場合は起動時点でエラーにする
// 接続文字列がないままDBを使おうとすると分かりにくいエラーになるため早期に止める
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

// PostgreSQL用のアダプターを作る
// 接続文字列を渡してDBへの接続方法を設定する
const adapter = new PrismaPg({ connectionString });

// アダプターを使ってPrismaクライアントを作る
// このprismaを他のファイルからimportしてDB操作に使う
const prisma = new PrismaClient({ adapter });

// このファイルのprismaを外から使えるように公開する
export default prisma;