// React から必要なフックを取り込む
import { useEffect, useState } from 'react';

// APIから取得するMenuGroupの型定義
type MenuGroup = {
  id: number;
  name: string;
};

// APIから取得するExerciseの型定義
type Exercise = {
  id: number;
  name: string;
};

// 1セット分の入力データの型定義
type SetInput = {
  weight: string;
  reps: string;
};

function WorkoutForm() {
  const [menuGroups, setMenuGroups] = useState<MenuGroup[]>([]);
  // メニューグループ一覧を保持する状態

  const [exercises, setExercises] = useState<Exercise[]>([]);
  // 種目一覧を保持する状態

  const [selectedMenuGroupId, setSelectedMenuGroupId] = useState<number | null>(null);
  // 選択中のメニューグループIDを保持する状態

  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(null);
  // 選択中の種目IDを保持する状態

  const [setCount, setSetCount] = useState(0);
  // 入力するセット数を保持する状態

  const [sets, setSets] = useState<SetInput[]>([]);
  // セット数ぶんの入力欄データを保持する状態

  const [message, setMessage] = useState<string | null>(null);
  // 保存成功・失敗のメッセージを保持する状態

  // 画面表示時にメニューグループと種目一覧を取得する
  useEffect(() => {
    fetch('http://localhost:3000/menu-groups')
      .then((res) => res.json())
      .then((data) => setMenuGroups(data))
      .catch(() => setMessage('メニューグループの取得に失敗しました'));

    fetch('http://localhost:3000/exercises')
      .then((res) => res.json())
      .then((data) => setExercises(data))
      .catch(() => setMessage('種目の取得に失敗しました'));
  }, []);

  const handleSetCountChange = (count: number) => {
    // セット数が変わったとき、入力欄の数をそれに合わせる
    setSetCount(count);
    setSets(Array.from({ length: count }, () => ({ weight: '', reps: '' })));
    // Array.from で count 個の空の入力データを作る
  };

  const handleSetChange = (index: number, field: 'weight' | 'reps', value: string) => {
    // 特定のセットの重量または回数が変わったとき、その行だけを更新する
    setSets((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
      // i === index の行だけ変更し、他はそのまま返す
    );
  };

  const handleSubmit = async () => {
    // 保存ボタンが押されたときの処理
    if (!selectedExerciseId || setCount === 0) {
      setMessage('種目とセット数を入力してください');
      return;
    }

    // 今日の日付を YYYY-MM-DD 形式で作る
    const today = new Date().toISOString().split('T')[0];

    // まずセッションを作成する
    const sessionRes = await fetch('http://localhost:3000/workout-sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: today }),
    });
    const session = await sessionRes.json();
    // 作成したセッションのidを取得する

    // セット数ぶんループしてセットを追加する
    for (let i = 0; i < sets.length; i++) {
      await fetch(`http://localhost:3000/workout-sessions/${session.id}/sets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseId: selectedExerciseId,
          setNumber: i + 1,
          // i は0始まりなので+1して「1セット目、2セット目...」にする
          weight: Number(sets[i].weight),
          reps: Number(sets[i].reps),
        }),
      });
    }

    setMessage('記録を保存しました');
    // 入力欄をリセットする
    setSelectedMenuGroupId(null);
    setSelectedExerciseId(null);
    setSetCount(0);
    setSets([]);
  };

  return (
    <div>
      <h2>トレーニング記録</h2>
      {message && <p style={{ color: 'blue' }}>{message}</p>}

      {/* メニューグループ選択 */}
      <div>
        <label>メニューグループ</label>
        <select
          value={selectedMenuGroupId ?? ''}
          onChange={(e) => setSelectedMenuGroupId(Number(e.target.value))}
          // 選択が変わるたびに selectedMenuGroupId を更新する
        >
          <option value="">選択してください</option>
          {menuGroups.map((mg) => (
            <option key={mg.id} value={mg.id}>{mg.name}</option>
          ))}
        </select>
      </div>

      {/* 種目選択 */}
      <div>
        <label>種目</label>
        <select
          value={selectedExerciseId ?? ''}
          onChange={(e) => setSelectedExerciseId(Number(e.target.value))}
        >
          <option value="">選択してください</option>
          {exercises.map((ex) => (
            <option key={ex.id} value={ex.id}>{ex.name}</option>
          ))}
        </select>
      </div>

      {/* セット数入力 */}
      <div>
        <label>セット数</label>
        <input
          type="number"
          min={1}
          max={10}
          value={setCount === 0 ? '' : setCount}
          onChange={(e) => handleSetCountChange(Number(e.target.value))}
          // 入力値が変わるたびにセット入力欄の数を更新する
        />
      </div>

      {/* セット数ぶんの入力欄を自動生成する */}
      {sets.map((s, i) => (
        <div key={i}>
          <label>{i + 1}セット目</label>
          <input
            type="number"
            placeholder="重量(kg)"
            value={s.weight}
            onChange={(e) => handleSetChange(i, 'weight', e.target.value)}
          />
          <input
            type="number"
            placeholder="回数"
            value={s.reps}
            onChange={(e) => handleSetChange(i, 'reps', e.target.value)}
          />
        </div>
      ))}

      <button onClick={handleSubmit}>記録を保存</button>
    </div>
  );
}

// このコンポーネントを外から使えるように公開する
export default WorkoutForm;