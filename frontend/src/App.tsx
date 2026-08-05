// MenuGroupListコンポーネントを取り込む
// components/MenuGroupList.tsxで定義したメニューグループ管理画面
import MenuGroupList from './components/MenuGroupList';

// ExerciseListコンポーネントを取り込む
// components/ExerciseList.tsxで定義した種目管理画面
import ExerciseList from './components/ExerciseList';

// WorkoutFormコンポーネントを取り込む
// components/WorkoutForm.tsxで定義したトレーニング記録入力画面
import WorkoutForm from './components/WorkoutForm';

// Appは「どのコンポーネントをどこに並べるか」だけを担当する入口ファイル
// 処理の実体は各コンポーネント内に書く
function App() {
  return (
    <div>
      {/* アプリ全体のタイトル */}
      <h1>筋トレ管理アプリ</h1>

      {/* トレーニング記録入力セクション */}
      <WorkoutForm />

      {/* 区切り線 */}
      <hr />

      {/* メニューグループ管理セクション */}
      <MenuGroupList />

      {/* 区切り線 */}
      <hr />

      {/* 種目管理セクション */}
      <ExerciseList />
    </div>
  );
}

// Appコンポーネントを外に公開する
// main.tsxからimportして画面に描画する
export default App;