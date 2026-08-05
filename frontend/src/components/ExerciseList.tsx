// ReactからuseEffectとuseStateを取り込む
import { useEffect, useState } from 'react';

// Exerciseのデータ型を定義する
// APIから返ってくるデータの形を明示する
type Exercise = {
  id: number;
  name: string;
  deletedAt: string | null;
};

function ExerciseList() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  // exercises: 一覧データを保持する変数、初期値は空配列

  const [error, setError] = useState<string | null>(null);
  // error: エラーメッセージを保持する変数

  const [newName, setNewName] = useState('');
  // newName: 新規作成フォームの入力内容を保持する変数

  const [editingId, setEditingId] = useState<number | null>(null);
  // editingId: 今編集中の行のidを保持する変数

  const [editingName, setEditingName] = useState('');
  // editingName: 編集中の入力欄の内容を保持する変数

  const fetchExercises = () => {
    // GET /exercisesを呼び出して一覧データを取得する関数
    fetch('http://localhost:3000/exercises')
      .then((res) => res.json())
      .then((data) => setExercises(data))
      // 取得したデータでexercises状態を更新する
      .catch(() => setError('データの取得に失敗しました'));
  };

  useEffect(() => {
    fetchExercises();
    // 画面表示時に1度だけ実行する
  }, []);

  const handleCreate = () => {
    // 作成ボタンが押されたときの処理
    if (newName.trim() === '') return;

    fetch('http://localhost:3000/exercises', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.trim() }),
      // 入力内容をJSON文字列に変換して送る
    })
      .then((res) => res.json())
      .then(() => {
        setNewName('');
        fetchExercises();
        // 作成成功したら入力欄を空にして一覧を再取得する
      })
      .catch(() => setError('作成に失敗しました'));
  };

  const handleDelete = (id: number) => {
    // 削除ボタンが押されたときの処理
    fetch(`http://localhost:3000/exercises/${id}`, {
      method: 'DELETE',
    })
      .then(() => fetchExercises())
      .catch(() => setError('削除に失敗しました'));
  };

  const handleEditStart = (ex: Exercise) => {
    // 編集ボタンが押されたときの処理
    setEditingId(ex.id);
    setEditingName(ex.name);
    // 編集対象のidと現在の名前をセットする
  };

  const handleEditCancel = () => {
    // キャンセルボタンが押されたときの処理
    setEditingId(null);
    setEditingName('');
    // 編集状態をリセットする
  };

  const handleEditSave = (id: number) => {
    // 保存ボタンが押されたときの処理
    if (editingName.trim() === '') return;

    fetch(`http://localhost:3000/exercises/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editingName.trim() }),
    })
      .then((res) => res.json())
      .then(() => {
        setEditingId(null);
        setEditingName('');
        fetchExercises();
        // 更新成功したら編集状態をリセットして一覧を再取得する
      })
      .catch(() => setError('更新に失敗しました'));
  };

  return (
    <div>
      <h2>種目管理</h2>

      {/* errorがnullでないときだけエラーメッセージを表示する */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* 新規作成フォーム */}
      <div>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          // 入力内容が変わるたびにnewName状態を更新する
          placeholder="種目名を入力"
        />
        <button onClick={handleCreate}>作成</button>
      </div>

      {/* exercisesが0件のときはメッセージ、それ以外は一覧を表示する */}
      {exercises.length === 0 ? (
        <p>種目がありません</p>
      ) : (
        <ul>
          {exercises.map((ex) => (
            // exercises配列をループして各行を表示する
            <li key={ex.id}>
              {editingId === ex.id ? (
                // 編集中の行は入力欄とボタンを表示する
                <>
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                  />
                  <button onClick={() => handleEditSave(ex.id)}>保存</button>
                  <button onClick={handleEditCancel}>キャンセル</button>
                </>
              ) : (
                // 編集中でない行は名前と編集・削除ボタンを表示する
                <>
                  {ex.name}
                  <button onClick={() => handleEditStart(ex)}>編集</button>
                  <button onClick={() => handleDelete(ex.id)}>削除</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// このコンポーネントを外から使えるように公開する
export default ExerciseList;